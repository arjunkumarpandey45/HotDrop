import express from 'express'
import { protect } from '../middleware/protect.js';
import { getAllUser, toggleFollow } from '../controller/userController.js';
const router = express.Router();
router.post('/togglefollow',protect,toggleFollow)
router.get('/',protect,getAllUser)
export default router;