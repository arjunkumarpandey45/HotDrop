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
