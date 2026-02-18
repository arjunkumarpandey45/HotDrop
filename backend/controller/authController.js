import User from "../model/userModel.js";
import response from "../utils/responseHandler.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
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

    const VerificationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5m",
    });

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
      hotdropId: newUser.hotdropId,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", null, error.message);
  }
};
