import express from 'express'
import { forgotPassword, login, logout, registerUser, reVerificationMail, Verification } from '../controller/authController.js'
import { protect } from '../middleware/protect.js';
const router = express.Router();


router.post('/register',registerUser)
router.get('/verification/:token',Verification)
router.post('/reverificationmail',reVerificationMail)
router.post('/login',login)
router.post('/logout',protect,logout)
router.post('/forgotpassword',forgotPassword)
export default router;