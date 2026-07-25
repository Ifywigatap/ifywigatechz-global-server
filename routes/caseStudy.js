import express from 'express';
import {
  createCaseStudy,
  getAllCaseStudies,
  getFeaturedCaseStudies,
  getCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
} from '../controllers/caseStudyController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
// --- Specific routes must come before generic ones to avoid shadowing ---
router.post('/', authMiddleware, adminMiddleware, createCaseStudy);
router.get('/', getAllCaseStudies);
router.get('/featured', getFeaturedCaseStudies); // Specific route for featured items
router.get('/:identifier', getCaseStudy); // Generic route for ID, slug, or numericId
router.put('/:id([0-9a-fA-F]{24})', authMiddleware, adminMiddleware, updateCaseStudy); // Route only matches valid Mongo ObjectIDs
router.delete('/:id([0-9a-fA-F]{24})', authMiddleware, adminMiddleware, deleteCaseStudy); // Route only matches valid Mongo ObjectIDs

export default router;
