import User from "../model/userModel.js";
import Follow from "../model/followModel.js";
import Post from "../model/postModel.js";
import response from "../utils/responseHandler.js";
import { v2 as cloudinary } from "cloudinary";
export const toggleFollow = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const myId = req.user._id;

    if (myId.toString() === userIdToFollow) {
      return response(res, 400, "You cannot follow yourself!");
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) return response(res, 404, "User not found!");

 
    const existingFollow = await Follow.findOne({
      follower: myId,
      following: userIdToFollow,
    });

    if (existingFollow) {
      // --- UNFOLLOW LOGIC ---
      await Promise.all([
        Follow.deleteOne({ _id: existingFollow._id }),
        User.findByIdAndUpdate(myId, {
          $pull: { following: userIdToFollow }, 
          $inc: { followingCount: -1 },
        }),
        User.findByIdAndUpdate(userIdToFollow, {
          $pull: { followers: myId }, 
          $inc: { followerCount: -1 },
        }),
      ]);

      const updatedTargetUser = await User.findById(userIdToFollow).select(
        "followerCount followers hotdropId profilePicture" // 🔥 
      );

      return response(res, 200, `Unfollowed @${updatedTargetUser.hotdropId}`, {
        isFollowing: false,
        followerCount: updatedTargetUser.followerCount,
        profilePicture: updatedTargetUser.profilePicture,
        followers: updatedTargetUser.followers, 
      });
    } else {
      // --- FOLLOW LOGIC ---
      await Promise.all([
        Follow.create({ follower: myId, following: userIdToFollow }),
        User.findByIdAndUpdate(myId, {
          $push: { following: userIdToFollow },
          $inc: { followingCount: 1 },
        }),
        User.findByIdAndUpdate(userIdToFollow, {
          $push: { followers: myId }, 
          $inc: { followerCount: 1 },
        }),
      ]);

      const updatedTargetUser = await User.findById(userIdToFollow).select(
        "followerCount followers hotdropId profilePicture"
      );

      return response(res, 200, `Followed @${userToFollow.hotdropId}`, {
        isFollowing: true,
        followerCount: updatedTargetUser.followerCount,
        profilePicture: updatedTargetUser.profilePicture,
        followers: updatedTargetUser.followers, 
      });
    }
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const getAllUser = async (req, res) => {
  try {
    const myId = req.user?._id;
    const users = await User.find({ _id: { $ne: myId } })
      .select("hotdropId username profilePicture")
      .limit(20);

    return response(res, 200, "Users fetched successfully", { users });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const checkAuth = async (req, res) => {
  const userId = req.user?._id;
  try {
    if (!userId) {
      return response(
        res,
        401,
        "Unauthorized ! Please login to access HotDrop",
      );
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return response(res, 404, "User not found with this session");
    }
    return response(res, 200, "User authenticated successfully", { user });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const getUserByHotdropId = async (req, res) => {
  const { hotdropId } = req.params;

  const loggedInUserId = req.user?._id;
  try {
    const user = await User.findOne({ hotdropId }).select("-password").populate('followers', 'username hotdropId profilePicture').populate('following', 'username hotdropId profilePicture').populate({ path: 'posts', populate: [{ path: 'likes', select: 'username hotdropId profilePicture' }, { path: 'comments.user', select: 'username hotdropId profilePicture' }] });
    if (!user || user.length === 0) {
      return response(res, 404, "User not found with this hotdropId");
    }
    const isOwner = loggedInUserId
      ? loggedInUserId.toString() === user._id.toString()
      : false;
    return response(res, 200, "User profile fetched successfully", {
      user,
      isOwner,
    });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};
export const bioUpdate = async (req, res) => {
  const loggedInUserId = req.user._id.toString();
  const { userIdFromParams } = req.params;
  console.log("--- DEBUG START ---");
  console.log("1. Params ID:", userIdFromParams); // Check if this matches your route :id
  console.log("2. Logged In User ID:", req.user?._id);
  if (userIdFromParams && loggedInUserId !== userIdFromParams) {
    return response(res, 403, "You'r not Owner 🛑");
  }

  try {
    const user = await User.findById(loggedInUserId);
    if (!user) return response(res, 404, "User not found!");
    const updateData = {
      bio: req.body.bio,
      username: req.body.username,
      hotdropId: req.body.hotdropId,
      "socialLinks.github": req.body.github,
      "socialLinks.portfolio": req.body.portfolio,
      "socialLinks.linkedin": req.body.linkedin,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
    };
    if (req.body.hotdropId) {
      const existingUser = await User.findOne({
        hotdropId: req.body.hotdropId,
        _id: { $ne: loggedInUserId },
      });
      if (existingUser) {
        return response(res, 400, " HotdropId already taken! 😕");
      }
    }

    if (req.file) {
      if (user.profilePicture) {
        try {
          const urlParts = user.profilePicture.split("/");
          const fileNameWithExt = urlParts.pop();
          const publicId = fileNameWithExt.split(".")[0];
          const folderName = urlParts.pop();

          const fullPublicId = `${folderName}/${publicId}`;

          console.log("🔥 Deleting old image:", fullPublicId);
          await cloudinary.uploader.destroy(fullPublicId);
        } catch (err) {
          console.error("Cloudinary Delete Error:", err.message);
        }
      }

      updateData.profilePicture = req.file.path;
    }
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    ).select("-password").populate("followers", "username hotdropId profilePicture")
      .populate("following", "username hotdropId profilePicture")
      .populate("posts");
console.log("🔥updated")
    return response(res, 200, "Profile updated successfully! ✨", updatedUser);
  } catch (error) {
    return response(res, 500, "Update failed", null, error.message);
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("followers", "username hotdropId profilePicture")
      .populate("following", "username hotdropId profilePicture")
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } }, 
        populate: [{
          path: "comments.user", 
          select: "hotdropId profilePicture"
        },{ path: "likes", select: "hotdropId profilePicture" }]
      });
    

    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "User data fetched", { user });
  } catch (error) {
    return response(res, 500, "Server error", null, error.message);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { hotdropId: { $regex: q, $options: 'i' } }
      ]
    })
    .select("username hotdropId profilePicture") 
    .limit(15); 

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();
    const targetUserId = req.params.targetUserId;

    if (loggedInUserId !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account!",
        
      });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // --- 🚀 CLOUDINARY CLEANUP LOGIC ---
    const getPublicIdFromUrl = (url) => {
      if (!url || !url.includes("cloudinary")) return null;
      try {
        const parts = url.split("/");
        const publicIdWithExtension = parts.slice(-2).join("/");
        const publicId = publicIdWithExtension.substring(
          0,
          publicIdWithExtension.lastIndexOf("."),
        );
        return publicId;
      } catch (error) {
        console.error("Error extracting public_id from URL:", url, error);
        return null;
      }
    };

    // A. Delete Profile Picture from Cloudinary
    if (user.profilePicture) {
      const profilePublicId = getPublicIdFromUrl(user.profilePicture);
      if (profilePublicId) {
        await cloudinary.uploader.destroy(profilePublicId);
      }
    }

    // B. Delete all Post Images from Cloudinary
    const userPosts = await Post.find({ user: loggedInUserId });
    const imageDeletionPromises = [];
    for (const post of userPosts) {
      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          if (image.public_id) {
            imageDeletionPromises.push(cloudinary.uploader.destroy(image.public_id));
          }
        }
      }
    }
    await Promise.all(imageDeletionPromises);

    // --- 🧹 DATABASE CLEANUP LOGIC ---

    // 1. Remove user's likes from all posts
    await Post.updateMany(
      { likes: loggedInUserId },
      { $pull: { likes: loggedInUserId }, $inc: { likeCount: -1 } },
    );

    // 2. Remove user's comments from all posts
    await Post.updateMany(
      { "comments.user": loggedInUserId },
      { 
        $pull: { comments: { user: loggedInUserId } },
        $inc: { commentCount: -1 }
      },
    );

    // 3. Remove user from other users' followers/following lists
    await User.updateMany(
      { followers: loggedInUserId },
      { $pull: { followers: loggedInUserId }, $inc: { followerCount: -1 } },
    );
    await User.updateMany(
      { following: loggedInUserId },
      { $pull: { following: loggedInUserId }, $inc: { followingCount: -1 } },
    );
    
    // 4. Delete all of the user's posts
    await Post.deleteMany({ user: loggedInUserId });

    // 5. Delete the user's follow/following records
    await Follow.deleteMany({ $or: [{ follower: loggedInUserId }, { following: loggedInUserId }] });

    // 6. Finally, delete the user account
    await User.findByIdAndDelete(loggedInUserId);

    // 7. Clear cookie and send response
    res.clearCookie("accessToken");
    res.status(200).json({
      success: true,
      message:
        "Account and all associated data (posts, images, comments, likes) have been successfully deleted.",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error: Account delete failed. Please try again later." 
    });
  }
}