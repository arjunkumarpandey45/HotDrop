import express from 'express'
import { protect } from '../middleware/protect.js';
import { checkAuth, getAllUser, toggleFollow } from '../controller/userController.js';
const router = express.Router();
router.post('/togglefollow',protect,toggleFollow)
router.get('/',protect,getAllUser)
router.get('/checkauth',protect,checkAuth)
export default router;