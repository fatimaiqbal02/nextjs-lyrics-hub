import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {

  if(mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb Database Connected Succesfully")
  } catch (error) {
    console.log("Mongodb Database Connection Failed", error)
  }
};
