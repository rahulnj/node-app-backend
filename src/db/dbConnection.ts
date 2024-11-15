import mongoose from 'mongoose';
import { APP_CONFIG } from '@Config/appConfig';
import logger from '@Utils/logger';

const { MONGO_URI } = APP_CONFIG;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    logger.info('Connected to database');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Database connection failed', { error: error.message });
    } else {
      logger.error('Database connection failed', { error: 'Unknown error' });
    }
    process.exit(1);
  }
};

export default connectDB;
