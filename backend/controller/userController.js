import User from "../model/userModel.js";
import Follow from "../model/followModel.js";
import response from "../utils/responseHandler.js";
import { v2 as cloudinary } from "cloudinary";
export const toggleFollow = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const myId = req.user._id;

    if (myId.toString() === userIdToFollow) {
      return response(
        res,
        400,
        "Bhai, khud ko follow/unfollow nahi kar sakte!",
      );
    }

    const existingFollow = await Follow.findOne({
      followers: myId,
      following: userIdToFollow,
    });

    if (existingFollow) {
      await Promise.all([
        Follow.deleteOne({ _id: existingFollow._id }),
        User.findByIdAndUpdate(myId, { $inc: { followingCount: -1 } }),
        User.findByIdAndUpdate(userIdToFollow, { $inc: { followerCount: -1 } }),
      ]);
      const unfollowed =
        await User.findById(userIdToFollow).select("hotdropId");
      return response(
        res,
        200,
        `Unfollowed successfully ${unfollowed?.hotdropId}`,
        { isFollowing: false },
      );
    } else {
      await Promise.all([
        Follow.create({ followers: myId, following: userIdToFollow }),
        User.findByIdAndUpdate(myId, { $inc: { followingCount: 1 } }),
        User.findByIdAndUpdate(userIdToFollow, { $inc: { followerCount: 1 } }),
      ]);
      const followed = await User.findById(userIdToFollow).select("hotdropId");
      return response(
        res,
        200,
        `Followed successfully ${followed?.hotdropId}`,
        { isFollowing: true },
      );
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
    const user = await User.findOne({ hotdropId }).select("-password");
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

  if (userIdFromParams && loggedInUserId !== userIdFromParams) {
    return response(
      res,
      403,
      "Bhai, kisi aur ki profile edit karna paap hai! 🛑",
    );
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
        _id: { $ne: loggedInUserId } 
      });
      if (existingUser){
    return response(res,400,"Ye hotdropId already kisi aur ne le rakha hai! 😕")
}
    }



    if (req.file) {
      if (user.profilePicture) {
      const parts = user.profilePicture.split("/");
        const filename = parts.pop(); // e.g. "image_name.jpg"
        const publicId = filename.split(".")[0];
        await cloudinary.uploader.destroy(`HotDrop_Profiles/${publicId}`);
      }
if(req.file.length > 1){
    return response(res,400,"Ek baar mein sirf ek profile picture upload kar sakte ho! 🖼️")
}
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "HotDrop_Profiles",
      });
      updateData.profilePicture = uploadRes.secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true,  },
    ).select("-password");

    return response(res, 200, "Profile updated successfully! ✨", updatedUser);
  } catch (error) {
    return response(res, 500, "Update fail ho gaya", null, error.message);
  }
};
