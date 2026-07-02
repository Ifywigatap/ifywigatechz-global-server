import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // Prepares for strict query standards
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected! Waiting for auto-reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected successfully!');
    });

    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
