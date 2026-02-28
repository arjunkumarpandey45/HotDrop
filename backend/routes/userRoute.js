import express from 'express'
import { protect } from '../middleware/protect.js';
import { bioUpdate, checkAuth, getAllUser, getMe, getUserByHotdropId, toggleFollow } from '../controller/userController.js';
import { uploadProfile } from '../config/cloudinary.js';
import response from '../utils/responseHandler.js';
const router = express.Router();
router.post("/togglefollow", protect, toggleFollow);
router.get("/", protect, getAllUser);
router.get("/checkauth", protect, checkAuth);
router.get("/userprofile/:hotdropId", protect, getUserByHotdropId);

router.put( 
  "/bioupdate/:userIdFromParams",
  protect,
  (req, res, next) => {
    uploadProfile.single("images")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return response(
            res,
            400,
            "Bhai, ek baar mein sirf ek hi photo daal sakte ho! 🛑",
          );
        }
        if (err.code === "LIMIT_FILE_SIZE") {
          return response(
            res,
            400,
            "Bhai, photo 3MB se badi hai! Thodi choti photo daal. 📉",
          );
        }
        return response(res, 400, err.message);
      }
      next();
    });
}, bioUpdate);
router.get("/me", protect, getMe);
export default router; 
