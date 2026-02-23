import axios from "axios";
import Post from "../model/postModel.js";
import response from "../utils/responseHandler.js";
import slugify from "slugify";
import mongoose from "mongoose";
import User from "../model/userModel.js";
export const verifyLink = async (req, res) => {
  let { url } = req.body;
  if (!url) return response(res, 400, "URL is required");

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    await axios.get(url, {
      timeout: 5000,
      headers: { "User-Agent": "Mozilla/5.0" },
      validateStatus: (status) => status >= 200 && status < 500,
    });

    return response(res, 200, "Link verified! 🔥");
  } catch (error) {
    return response(res, 400, "Link dead hai ya reachable nahi hai.");
  }
};
export const createPost = async (req, res) => {
  try {
    const { title, description, projectLink, tags } = req.body;

    if (!req.files || req.files.length === 0) {
      return response(res, 400, "Please upload at least one image or video");
    }

    const images = [];
    let video = null;
    let videoCount = 0;

    req.files.forEach((file) => {
      const mediaData = {
        url: file.path,
        public_id: file.filename,
      };

      if (file.mimetype.startsWith("video/")) {
        videoCount++;
        video = mediaData;
      } else {
        images.push(mediaData);
      }
    });

    if (videoCount > 1) {
      return response(res, 400, "Only one video is allowed per post.");
    }

    const shareUrl = `${slugify(title || "hotdrop", { lower: true })}-${Date.now()}`;

    const newPost = await Post.create({
      user: req.user._id,
      title,
      description,
      projectLink,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      shareUrl,
      images,
      video,
      tags: tags ? tags.split(",").map((t) => t.trim().toLowerCase()) : [],
    });

    return response(res, 201, "Project Dropped Successfully! 🔥", newPost);
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return response(
      res,
      500,
      error.message || "Server par kuch locha ho gaya!",
    );
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ user: { $ne: null } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "hotdropId username email profilePicture")
        .populate("comments.user", "hotdropId profilePicture"),
      Post.countDocuments({ user: { $ne: null } })
    ]);

    return response(res, 200, "Posts fetched successfully", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: skip + posts.length < totalPosts
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
        .populate("comments.user", "hotdropId profilePicture"),
      Post.countDocuments({ user: userId })
    ]);

    
    return response(res, 200, "User posts fetched successfully", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: skip + posts.length < totalPosts
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
      (id) => id.toString() === userId.toString()
    );

    const updateOperation = alreadyLiked
      ? { $pull: { likes: userId }, $inc: { likeCount: -1 } }
      : { $addToSet: { likes: userId }, $inc: { likeCount: 1 } };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateOperation,
      {  returnDocument: "after", select: "likeCount likes" }
    );

    return response(res, 200,
      alreadyLiked ? "Post unliked" : "Post liked",
      {
        likeCount: Math.max(updatedPost.likeCount, 0),
        isLiked: !alreadyLiked
      },userId
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
            text: text.trim()
          }
        },
        $inc: { commentCount: 1 }
      },
      {
        returnDocument: "after",
        runValidators: true
      }
    ).populate("comments.user", "hotdropId profilePicture");

    if (!updatedPost) {
      return response(res, 404, "Post not found");
    }

    
    const newComment =
      updatedPost.comments[updatedPost.comments.length - 1];

    return response(
      res,
      201,
      "Comment added successfully",
      newComment
    );

  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};export const sharePost = async (req, res) => {
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
        select: "shareCount shareUrl"
      }
    );

    if (!post) {
      return response(res, 404, "Post not found");
    }

    return response(res, 200, "Share count updated", {
      shareCount: post.shareCount,
      shareUrl: `https://hotdrop.com/post/${post.shareUrl}`
    });

  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
