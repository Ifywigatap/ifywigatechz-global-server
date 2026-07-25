import express from 'express';
import { register, login, logout, getCurrentUser, updateProfile, changePassword, refreshToken, uploadAvatar, googleLogin } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { auditLog } from '../middleware/auditLog.js';
import { validateUserRegistration } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', auditLog('register'), validateUserRegistration, register);
router.post('/login', auditLog('login'), login);
router.post('/google', auditLog('google-login'), googleLogin);
router.post('/logout', authMiddleware, auditLog('logout'), logout);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, auditLog('change-password'), changePassword);
router.post('/refresh', refreshToken);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

export default router;
