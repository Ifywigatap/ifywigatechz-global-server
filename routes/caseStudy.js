import express from 'express';
import {
  createCaseStudy,
  getAllCaseStudies,
  getCaseStudyBySlug,
  updateCaseStudy,
  deleteCaseStudy
} from '../controllers/caseStudyController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createCaseStudy);
router.get('/', getAllCaseStudies);
router.get('/:slug', getCaseStudyBySlug);
router.put('/:id', authMiddleware, adminMiddleware, updateCaseStudy);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCaseStudy);

export default router;
