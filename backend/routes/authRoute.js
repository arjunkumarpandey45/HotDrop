import express from 'express'
import { login, registerUser, reVerificationMail, Verification } from '../controller/authController.js'
const router = express.Router();


router.post('/register',registerUser)
router.get('/verification/:token',Verification)
router.post('/reverificationmail',reVerificationMail)
router.post('/login',login)
export default router;