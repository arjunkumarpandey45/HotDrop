import User from "../model/userModel.js";
import Follow from "../model/followModel.js";
import response from "../utils/responseHandler.js";

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
    try{
        const user = await User.findOne({ hotdropId }).select("-password");
        if(!user || user.length === 0){
            return response(res, 404, "User not found with this hotdropId");
        }
        return response(res, 200, "User fetched successfully", { user})
    }catch(error){
        return response(res, 500, "Server error", null, error.message);
    }
}