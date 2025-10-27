import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders:['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.use(express.json());
const PORT = process.env.PORT || 8081;

app.get("/",(req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

//error middleware
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message: "Internal Server Error"});
})

//not found middleware
app.use((req,res,next)=>{
  res.status(404).json({message: "Route not found"});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});