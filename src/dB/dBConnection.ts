import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function connectDB(): Promise<void> {
  try {
    if (!process.env.MONGO_URI) {
      console.log('MONGO_URI not found in environment variables');
      return; 
    }
    
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
 
  }
}

export default connectDB;