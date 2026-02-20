import express from 'express'
import { changePassword, forgotPassword, login, logout, registerUser, reVerificationMail, Verification, verifyOtp } from '../controller/authController.js'
import { protect } from '../middleware/protect.js';
const router = express.Router();


router.post('/register',registerUser)
router.get('/verification/:token',Verification)
router.post('/reverificationmail',reVerificationMail)
router.post('/login',login)
router.post('/logout',protect,logout)
router.post('/forgotpassword',forgotPassword)
router.post('/verifyotp/:email',verifyOtp)
router.post('/changepassword',changePassword)
export default router;