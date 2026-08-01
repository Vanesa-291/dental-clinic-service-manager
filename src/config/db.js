import mongoose from 'mongoose';
import { MONGO_URI } from './env.config.js';

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB conectado correctamente.');
}
