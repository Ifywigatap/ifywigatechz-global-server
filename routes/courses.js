import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  getCoursesByCategory,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  addCourseReview,
  updateModuleProgress,
  getCourseProgress,
  getAllEnrolledStudents
} from '../controllers/courseController.js';
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js';
import { videoUpload } from '../middleware/videoUpload.js';

const router = express.Router();

// --- Specific routes must come before generic ones to avoid shadowing ---

// Admin and user-specific routes with unique prefixes
router.get('/admin/enrollments', authMiddleware, adminMiddleware, getAllEnrolledStudents);
router.get('/user/enrolled', authMiddleware, getEnrolledCourses);

// Public routes
router.get('/', optionalAuth, getAllCourses);
router.get('/featured', getAllCourses);
router.get('/category/:category', getCoursesByCategory);
router.get('/slug/:slug', optionalAuth, getCourseBySlug);

// Protected routes (authenticated users)
router.post('/progress', authMiddleware, updateModuleProgress);
router.get('/:courseId/progress', authMiddleware, getCourseProgress); // Specific sub-path
router.post('/:id/enroll', authMiddleware, enrollCourse);
router.post('/:id/review', authMiddleware, addCourseReview);

// Generic GET by ID (must be last among GETs with a single parameter)
router.get('/:id', optionalAuth, getCourseById);

// Admin CUD routes
router.post('/', authMiddleware, adminMiddleware, videoUpload.array('videos'), createCourse);
router.put('/:id', authMiddleware, adminMiddleware, videoUpload.array('videos'), updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

export default router;
