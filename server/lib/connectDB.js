import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // IMPORTANT for serverless
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // DO NOT swallow this
  }
};

export default connectDB;
