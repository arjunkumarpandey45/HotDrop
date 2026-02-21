import axios from "axios";
import Post from "../model/postModel.js";
import response from "../utils/responseHandler.js";
import slugify from "slugify";

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
