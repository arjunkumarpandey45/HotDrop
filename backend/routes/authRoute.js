import express from 'express'
import { registerUser, Verification } from '../controller/authController.js'
const router = express.Router();


router.post('/register',registerUser)
router.get('/verification/:token',Verification)
export default router;