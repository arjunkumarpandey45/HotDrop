import express from 'express'
import { protect } from '../middleware/protect.js';
import { commentPost, createPost, getAllPosts, getPostsByUserId, likePost, sharePost, verifyLink } from '../controller/postController.js';
import upload from '../config/cloudinary.js';
const router = express.Router();
router.post('/verifylink',protect,verifyLink)
router.post("/createpost", protect, upload.array("images", 4), createPost);
router.get("/getallposts", getAllPosts);
router.get("/getpostbyuserid/user/:userId", getPostsByUserId);
router.post('/like/:postId',protect,likePost)
router.post('/comment/:postId', protect, commentPost);
router.post('/share/:postId', protect, sharePost);
export default router;