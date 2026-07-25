import multer from 'multer';
import { AppError } from './errorHandler.js';

// Store the file in memory as a Buffer, which is efficient for streaming to another service like Cloudinary
const storage = multer.memoryStorage();

export const videoUpload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Whitelist allowed video MIME types
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only MP4, MOV, AVI, WebM, and MPEG videos are allowed.', 400), false);
    }
  }
});