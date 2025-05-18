import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

mongoose.connect(process.env.MONGO_URL ?? '123').then(() => {
  console.log('connected to mongoose');
});
