import mongoose from 'mongoose';
import { AppConfig } from '../config/appConfig';

const { MONGO_URI } = AppConfig;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
