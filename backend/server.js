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
const URL=process.env.FRONTEND_URL
const corsOptions ={
  origin: URL,
  credentials: true ,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}; 
app.use(cors(corsOptions));

// 3. (Optional but Safe) Manually handle OPTIONS for all routes if CORS alone fails
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json())  
app.use(cookieParser())
app.use(passport.initialize())

app.use('/auth',authRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/bot',botRouter);
app.get('/', (req, res) => res.send("HotDrop Backend is Live! 🚀"));
app.listen(PORT, () => {
    connectDB(),
    startLiveTracking();
  console.log(`Example app listening on port ${PORT}`)
})
