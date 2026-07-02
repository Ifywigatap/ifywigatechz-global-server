import express from 'express';
import { verifyCertificate, downloadCertificate, getAllCertificates } from '../controllers/certificateController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllCertificates);
router.get('/verify/:certId', verifyCertificate);
router.get('/download/:courseId', authMiddleware, downloadCertificate);

export default router;