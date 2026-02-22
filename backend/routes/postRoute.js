import express from 'express'
import { protect } from '../middleware/protect.js';
import { createPost, getAllPosts, verifyLink } from '../controller/postController.js';
import upload from '../config/cloudinary.js';
const router = express.Router();
router.post('/verifylink',protect,verifyLink)
router.post("/createpost", protect, upload.array("images", 4), createPost);
router.get("/getallposts", getAllPosts);
export default router;