import express from 'express'
import { protect } from '../middleware/protect.js';
import { commentPost, createPost, deleteComment, deletePost, getAllPosts, getPostByPostId, getPostsByUserId, likePost, sharePost, verifyLink } from '../controller/postController.js';
import upload from '../config/cloudinary.js';
const router = express.Router();
router.post('/verifylink',protect,verifyLink)
router.post("/createpost", protect, upload.array("images", 4), createPost);
router.delete("/deletepost/:postId", protect, deletePost)
router.get("/getallposts", getAllPosts);
router.get("/getpostbyuserid/user/:userId", getPostsByUserId);
router.post('/like/:postId',protect,likePost)
router.post('/comment/:postId', protect, commentPost);
router.delete('/deletecomment/:postId/:commentId', protect, deleteComment);
router.post('/share/:postId', protect, sharePost);
router.get('/getpost/:postId', getPostByPostId);
export default router; 