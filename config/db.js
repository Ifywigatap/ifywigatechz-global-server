import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const msg = 'MONGODB_URI is not set. Please configure the connection string.';
    logger.error(msg);
    throw new Error(msg);
  }

  const maxAttempts = parseInt(process.env.MONGODB_CONNECT_RETRIES || '6', 10);
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      const conn = await mongoose.connect(uri, {
        // Mongoose 6+ uses these by default, but setting explicitly for clarity
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      logger.info(`MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ MongoDB disconnected! Waiting for auto-reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('✅ MongoDB reconnected successfully!');
      });

      return conn;
    } catch (error) {
      logger.error(`MongoDB connect attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxAttempts) {
        logger.error('Exceeded MongoDB connection attempts. Giving up.');
        throw error;
      }

      const backoffMs = Math.min(30000, 1000 * Math.pow(2, attempt));
      logger.info(`Retrying MongoDB connection in ${backoffMs}ms (attempt ${attempt + 1}/${maxAttempts})`);
      // wait before retrying
      // eslint-disable-next-line no-await-in-loop
      await sleep(backoffMs);
    }
  }
};

export default connectDB;
