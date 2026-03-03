import axios from "axios";
import Post from "../model/postModel.js";
import response from "../utils/responseHandler.js";
import slugify from "slugify";
import mongoose from "mongoose";
import * as cheerio from "cheerio";
import { v2 as cloudinary } from "cloudinary";
import User from "../model/userModel.js";
export const verifyLink = async (req, res) => {
  let { url } = req.body;
  if (!url) return response(res, 400, "URL is required");

 
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
   
    await axios.head(url, {
      timeout: 5000,
      headers: { "User-Agent": "Mozilla/5.0" },
      validateStatus: (status) => status >= 200 && status < 400,
    });

    return response(res, 200, "Link is Live! 🔥", { isLive: true, url });

  } catch (error) {
    
    try {
      await axios.get(url, {
        timeout: 5000,
        headers: { "User-Agent": "Mozilla/5.0" },
       
        maxContentLength: 1, 
        validateStatus: (status) => status >= 200 && status < 400,
      });

      return response(res, 200, "Link is Live! 🔥", { isLive: true, url });
    } catch (innerError) {
      return response(res, 400, "Link is dead or unreachable.");
    }
  }
};
export const createPost = async (req, res) => {
  try {
    const { title, description, projectLink, tags } = req.body;

    if (
      !req.files ||
      req.files.length === 0 ||
      !title ||
      !description ||
      !projectLink
    ) {
      return response(
        res,
        400,
        "All fields are required, and at least 1 image must be uploaded.",
      );
    }

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const shareUrl = `${slugify(title || "hotdrop", { lower: true })}-${Date.now()}`;

    const isLinkDeadStatus = false;
    const newPost = await Post.create({
      postId: new mongoose.Types.ObjectId(),
      user: req.user._id,
      title,
      description,
      projectLink: projectLink || null,
      isLinkDead: isLinkDeadStatus,
      lastChecked: projectLink ? new Date() : null,
      shareUrl,
      images,
      video: null,
      tags: tags ? tags.split(",").map((t) => t.trim().toLowerCase()) : [],
    });
  await User.findByIdAndUpdate(req.user._id, { 
      $push: { posts: newPost._id }, 
      $inc: { postCount: 1 } 
    }).populate("followers", "username hotdropId profilePicture")
      .populate("following", "username hotdropId profilePicture")
      .populate("posts");
    return response(res, 201, "Project Dropped Successfully! 🔥", newPost);
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return response(
      res,
      500,
      "Post create karne mein error aaya",
      null,
      error.message,
    );
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const loggedInUserId = req.user._id.toString();

    const post = await Post.findById(postId);

    if (!post) {
      return response(res, 404, "Bhai, ye post toh pehle se hi gayab hai!");
    }

    if (post.user.toString() !== loggedInUserId) {
      return response(res, 403, "Oye! Dusre ki post delete karna mana hai. 🛑");
    }

    if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map((img) =>
        cloudinary.uploader
          .destroy(img.public_id)
          .catch((err) =>
            console.log(
              `Cloudinary delete failed for ${img.public_id}:`,
              err.message,
            ),
          ),
      );
      await Promise.all(deletePromises);
    }

    await Post.findByIdAndDelete(postId);

    return response(
      res,
      200,
      "Project deleted successfully from everywhere! 🗑️",
    );
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return response(
      res,
      500,
      "Delete logic mein kuch locha hai",
      null,
      error.message,
    );
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const { search, tag } = req.query;
    let query = { user: { $ne: null } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (tag) {
      query.tags = tag.toLowerCase();
    }
    const [posts, totalPosts] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "hotdropId username email profilePicture")
        .populate("comments.user", "hotdropId profilePicture")
        .lean(),

      Post.countDocuments(query),
    ]);

    return response(res, 200, "Posts fetched successfully", {
      posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return response(res, 400, "User ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(res, 400, "Invalid User ID format");
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return response(res, 404, "User not found");
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "hotdropId username email profilePicture")
        .populate("comments.user", "hotdropId profilePicture").lean(),
      Post.countDocuments({ user: userId }),
    ]);

    return response(res, 200, "User posts fetched successfully", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, "Invalid Post ID format");
    }

    const post = await Post.findById(postId).select("likes likeCount");
    if (!post) {
      return response(res, 404, "Post not found");
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    const updateOperation = alreadyLiked
      ? { $pull: { likes: userId }, $inc: { likeCount: -1 } }
      : { $addToSet: { likes: userId }, $inc: { likeCount: 1 } };

    const updatedPost = await Post.findByIdAndUpdate(postId, updateOperation, {
      returnDocument: "after",
      select: "likeCount likes",
    });

    return response(
      res,
      200,
      alreadyLiked ? "Post unliked" : "Post liked",
      {
        likeCount: Math.max(updatedPost.likeCount, 0),
        isLiked: !alreadyLiked,
      },
      userId,
    );
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return response(res, 400, "Comment text is required");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, "Invalid Post ID format");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            user: userId,
            text: text.trim(),
          },
        },
        $inc: { commentCount: 1 },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).populate("comments.user", "hotdropId profilePicture");

    if (!updatedPost) {
      return response(res, 404, "Post not found");
    }

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    return response(res, 201, "Comment added successfully", newComment);
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const loggedUserId = req.user._id;

    const post = await Post.findById(postId).select("comments");
    if (!post) return response(res, 404, "Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) return response(res, 404, "Comment not found");

    if (comment.user.toString() !== loggedUserId.toString()) {
      return response(res, 403, "You can only delete your own comments");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: commentId } },
        $inc: { commentCount: -1 },
      },
      { new: true },
    );

    return response(res, 200, "Comment deleted successfully 🗑️");
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, "Invalid Post ID format");
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { shareCount: 1 } },
      {
        returnDocument: "after",
        select: "shareCount shareUrl",
      },
    );

    if (!post) {
      return response(res, 404, "Post not found");
    }

    return response(res, 200, "Share count updated", {
      shareCount: post.shareCount,
      shareUrl: `https://hotdrop.com/post/${post.shareUrl}`,
    });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
