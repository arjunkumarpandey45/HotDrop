import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routes/authRoute.js'
import  postRouter from './routes/postRoute.js'
import userRouter from './routes/userRoute.js'
import { startLiveTracking } from './utils/cronJobs.js'
import passport from 'passport'
import botRouter from './routes/botRoute.js'
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
})); 
app.use(express.json())  
app.use(cookieParser())
app.use(passport.initialize())

app.use('/auth',authRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/bot',botRouter);
app.listen(PORT, () => {
    connectDB(),
    startLiveTracking();
  console.log(`Example app listening on port ${PORT}`)
})
