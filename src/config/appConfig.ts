import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
};
