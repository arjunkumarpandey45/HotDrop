import express from 'express'
import { protect } from '../middleware/protect.js';
import { bioUpdate, checkAuth, getAllUser, getUserByHotdropId, toggleFollow } from '../controller/userController.js';
const router = express.Router();
router.post('/togglefollow',protect,toggleFollow)
router.get('/',protect,getAllUser)
router.get('/checkauth',protect,checkAuth)
router.get('/userprofile/:hotdropId',protect,getUserByHotdropId)
router.put('/bioupdate/:userIdFromParams',protect,bioUpdate)
export default router; 