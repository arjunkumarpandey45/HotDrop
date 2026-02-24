import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "hotdrops_images",
      resource_type: "image", 
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:eco" },
        { fetch_format: "auto" },
      ],
    };
  },
});

const fileFilter = (req, file, cb) => {
  
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Sirf images upload kar sakte ho bhai!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 6 * 1024 * 1024, 
  }, 
});


export const uploadImages = upload.array("images", 3);

export default upload;