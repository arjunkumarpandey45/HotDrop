import User from "../model/userModel.js";
import Follow from "../model/followModel.js";
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
        "followerCount followers hotdropId profilePicture",
      );
      return response(res, 200, `Unfollowed @${updatedTargetUser.hotdropId}`, {
        isFollowing: false,
        followerCount: updatedTargetUser.followerCount,
        profilePicture: updatedTargetUser.profilePicture,
        followers: updatedTargetUser.followers, // Sending fresh list for the modal
      });
    } else {
      // --- FOLLOW LOGIC ---
      await Promise.all([
        Follow.create({ follower: myId, following: userIdToFollow }),
       
        User.findByIdAndUpdate(myId, {
          $push: { following: userIdToFollow },
          $inc: { followingCount: 1 },
        }),
        // Update their account: Add my ID to their 'followers' array
        User.findByIdAndUpdate(userIdToFollow, {
          $push: { followers: myId },
          $inc: { followerCount: 1 }, // Standardized name
        }),
      ]);

      const updatedTargetUser = await User.findById(userIdToFollow).select(
        "followerCount followers hotdropId profilePicture",
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
    if (!user) return response(res, 404, "User nahi mila!");
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
