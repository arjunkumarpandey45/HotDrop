import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    shareUrl: { type: String, required: true, unique: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      maxLength: [50, "Description cannot exceed 50 characters"],
    },
    projectLink: {
      type: String,
      trim: true,
      default: null,
    },
    isLinkDead: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (val) {
         
          return val && val.length > 0 && val.length <= 3;
        },
        message: "You must upload between 1 and 3 images.",
      },
    },
   
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        stars: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true
      },
    ],

    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
postSchema.index({ createdAt: -1 });
const Post = mongoose.model("Post", postSchema);
export default Post;
