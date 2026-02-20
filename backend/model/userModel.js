import mongoose from "mongoose";
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
const userSchema = new mongoose.Schema(
  {hotdropId: {
      type: String,
      required: true,
      unique:true,
       lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
      select: false,
        required: function () {
    return this.authMethod === "local";
  }
    },
    googleId: {
      type: String,
      default: null,
    },
    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    githubProfile: { type: String,  match: [urlRegex, "Invalid URL"],default: null },
    portfolioLink: { type: String,  match: [urlRegex, "Invalid URL"],default: null },
    linkedinLink: { type: String,  match: [urlRegex, "Invalid URL"],default: null },
    bio: { type: String, maxLength: 200, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
  token: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    }, otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
    phoneNumber: {
      type: Number,
      default:null
      
    },

    profilePicture: {
      type: String,
      default: null,
    },
posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followerCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
