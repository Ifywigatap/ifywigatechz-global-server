import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
  // Prefer explicit MONGODB_URI (Atlas). If not set, fall back to a local MongoDB
  // This lets developers run the server locally without Atlas while they
  // whitelist their IP or configure credentials.
  const envUri = process.env.MONGODB_URI;
  const localFallback = 'mongodb://127.0.0.1:27017/ifywigatechz';
  const uri = envUri || localFallback;

  if (!envUri) {
    logger.warn('MONGODB_URI not set — using local fallback MongoDB at mongodb://127.0.0.1:27017/ifywigatechz');
  }

  const maxAttempts = parseInt(process.env.MONGODB_CONNECT_RETRIES || '6', 10);
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      const conn = await mongoose.connect(uri, {
        // Mongoose 6+ uses defaults for parser and topology.
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
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
