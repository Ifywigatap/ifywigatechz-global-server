import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  logger.warn('⚠️ Cloudinary environment variables are missing. Image uploads may fail.');
} else {
  logger.info('☁️ Cloudinary configured successfully.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;