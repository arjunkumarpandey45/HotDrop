import User from "../model/userModel.js";
import response from "../utils/responseHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokenGenrate.js";
import { emailVerify } from "../emailVerify.js/emailVerify.js";


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

  
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "15m" } 
    );

   
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
    }).select("+password");

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
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    existingUser.isLoggedIn = true;
    await existingUser.save();
   
    return response(res, 200, `Welcome Mr ${existingUser.username}`, {
      userId: existingUser._id,
      accessToken: accessToken,
      hotdropId: existingUser.hotdropId,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
