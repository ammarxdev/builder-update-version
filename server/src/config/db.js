import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
export const connectDB = async (MONGODB_URI) => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Check your .env configuration.');
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
