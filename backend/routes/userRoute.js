import express from 'express'
import { protect } from '../middleware/protect.js';
import { toggleFollow } from '../controller/userController.js';
const router = express.Router();
router.post('/togglefollow',protect,toggleFollow)
export default router;