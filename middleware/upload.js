import multer from 'multer';
import { AppError } from './errorHandler.js';

// Store the file in memory as a Buffer, instead of writing to disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Strict 2MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Whitelist allowed MIME types to prevent malicious uploads (like executable files)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.', 400), false);
    }
  }
});