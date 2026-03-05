import User from "../model/userModel.js";
import response from "../utils/responseHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokenGenrate.js";
import { emailVerify } from "../emailVerify.js/emailVerify.js";
import { sentOtpMail } from "../sentOTP/sentOTP.js";

export const registerUser = async (req, res) => {
  try {
    const { hotdropId, username, email, password, gender, dateOfBirth } =
      req.body;

    if (!email || !hotdropId || !username) {
      return response(res, 400, "Required fields are missing");
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedId = hotdropId.toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { hotdropId: normalizedId }],
    });

    if (existingUser) {
      const isEmailMatch = existingUser.email.toLowerCase() === normalizedEmail;
      const message = isEmailMatch
        ? "Email already registered"
        : "HotdropId is already taken";
      return response(res, 400, message);
    }

    if (!password) {
      return response(res, 400, "Password is required");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      hotdropId: normalizedId,
      email: normalizedEmail,
      password: hashedPassword,
      gender,
      dateOfBirth,
      username,
    });

    const VerificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "60m",
      },
    );

    await emailVerify(VerificationToken, normalizedEmail);
    newUser.token = VerificationToken;
    await newUser.save();
    const accessToken = generateToken(newUser);

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return response(res, 201, "User Created Successfully", {
      userId: newUser._id,
      username: newUser.username,
      VerificationToken: VerificationToken,
      hotdropId: newUser.hotdropId,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
export const Verification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return response(res, 400, "Token is missing");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      const msg =
        error.name === "TokenExpiredError" ? "Link expired" : "Invalid token";
      return response(res, 400, msg);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return response(res, 404, "User not found");
    }

    if (user.token !== token) {
      return response(
        res,
        400,
        "This link is no longer valid or has been used",
      );
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    return response(
      res,
      200,
      "Email verified successfully! You can now login.",
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
export const reVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response(res, 400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return response(res, 404, "User not found");
    }

    if (user.isVerified) {
      return response(res, 400, "User already verified. Please login.");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    user.token = token;
    await user.save();

    await emailVerify(token, user.email);

    return response(res, 200, "Verification email sent successfully");
  } catch (error) {
    console.error("Re-verification error:", error.message);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
export const login = async (req, res) => {
  try {
    const { hotdropId, email, password } = req.body;

    if ((!email && !hotdropId) || !password) {
      return response(res, 400, "Required fields are missing");
    }

    const normalizedEmail = email ? email.toLowerCase() : null;
    const normalizedId = hotdropId ? hotdropId.toLowerCase() : null;

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { hotdropId: normalizedId }].filter(
        Boolean,
      ),
    }).select("+password")
    

    if (!existingUser) {
      return response(res, 400, "User not found");
    }
    if (!existingUser.isVerified) {
      return response(res, 400, "User not Verified");
    }
    const matchPassword = await bcryptjs.compare(
      password,
      existingUser.password,
    );

    if (!matchPassword) {
      return response(res, 400, "Invalid email or password");
    }

    const accessToken = generateToken(existingUser);
    const user = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { $set: { isLoggedIn: true } },
      { 
        returnDocument: "after",
        runValidators: true 
      }
    )
    .populate("followers", "username hotdropId profilePicture")
    .populate("following", "username hotdropId profilePicture")
    .populate("posts");
    console.log("🔥 Followers Check:", user.followers);
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
   

    return response(res, 200, `Welcome Mr ${user.username}`, {
      userId: user._id,
      username: user.username,
      hotdropId: user.hotdropId,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      portfolio: user.socialLinks?.portfolio || null,
      github: user.socialLinks?.github || null,
      linkedin: user.socialLinks?.linkedin || null,
      followers: user.followers || [],
      following: user.following || [],
      posts: user.posts || [],

      followerCount: user.followerCount || 0,
      followingCount: user.followingCount || 0,
      postCount: user.postCount || 0,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { isLoggedIn: false });
    }

    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response(res, 200, "Logout Successfully and status updated in DB");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("EMAIL RECEIVED:", email);

    if (!email) {
      return response(res, 404, "email not found");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, "User not");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();
    await sentOtpMail(email, otp);
    return response(res, 200, "Otp Sent to Your Mail");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;
    if (!otp) {
      return response(res, 400, "otp requires");
    }
    if (!email) {
      return response(res, 400, "email requires");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return response(res, 404, "user not found");
    }
    if (new Date() > user.otpExpire) {
      return response(res, 400, "OTP has expired. Please request a new one.");
    }
    if (otp !== user.otp) {
      return response(res, 400, "incorrect otp");
    }

    user.otp = null;
    user.otpExpire = null;
    await user.save();
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" },
    );
    return response(res, 200, "otp verified", { resetToken, user });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};
export const changePassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return response(res, 404, "token or password missing");
    }
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return response(res, 404, "user not found");
    }
    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();
    return response(res, 200, "password changed");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};
