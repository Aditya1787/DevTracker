import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  console.log(env.MONGO_URI)
  console.log("Bona Madarchod")
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.MONGO_URI);

    console.log(`\x1b[32m[MongoDB Connected]: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[MongoDB Connection Error]: ${error.message}\x1b[0m`);
    // Exit process with failure in production, but during step 1 development, we might not have a local db running
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
