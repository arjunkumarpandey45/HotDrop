import express from 'express'
import { changePassword, forgotPassword, login, logout, registerUser, reVerificationMail, Verification, verifyOtp } from '../controller/authController.js'
import { protect } from '../middleware/protect.js';
import passport from 'passport';
import { generateToken } from '../utils/tokenGenrate.js';
const router = express.Router();


router.post('/register',registerUser)
router.get('/verification/:token',Verification)
router.post('/reverificationmail',reVerificationMail)
router.post('/login',login)
router.post('/logout',protect,logout)
router.post('/forgotpassword',forgotPassword)
router.post('/verifyotp/:email',verifyOtp)
router.post('/changepassword',changePassword)

//google auth 
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', {session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }), (req, res) => {
const accessToken = generateToken(req.user)
   res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    }),
    res.redirect(`${process.env.FRONTEND_URL}`);
})
export default router;