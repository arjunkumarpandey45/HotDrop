const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "hotdrops_content",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? ["mp4", "mov"]
        : ["jpg", "png", "jpeg", "webp"],
      transformation: isVideo
        ? [
            { quality: "auto:eco" },
            { fetch_format: "mp4" }
          ]
        : [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:eco" },
            { fetch_format: "auto" }
          ]
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});
export default upload;