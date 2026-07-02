import express from 'express';
import {
  createSolution,
  getAllSolutions,
  getSolutionById,
  getSolutionBySlug,
  getSolutionsByCategory,
  getSolutionsByIndustry,
  getFeaturedSolutions,
  updateSolution,
  deleteSolution
} from '../controllers/solutionController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSolutions);
router.get('/featured', getFeaturedSolutions);
router.get('/category/:category', getSolutionsByCategory);
router.get('/industry/:industry', getSolutionsByIndustry);
router.get('/slug/:slug', getSolutionBySlug);
router.get('/:id', getSolutionById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createSolution);
router.put('/:id', authMiddleware, adminMiddleware, updateSolution);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSolution);

export default router;
