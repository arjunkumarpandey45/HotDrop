import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routes/authRoute.js'
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/auth',authRouter)

app.listen(PORT, () => {
    connectDB()
  console.log(`Example app listening on port ${PORT}`)
})
