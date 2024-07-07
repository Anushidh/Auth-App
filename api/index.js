import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
configDotenv()
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err);
})
const app = express()

app.use(express.json())

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})



app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  })
})