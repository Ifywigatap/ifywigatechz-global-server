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

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllCourses);
router.get('/featured', getAllCourses); // Get featured courses
router.get('/category/:category', getCoursesByCategory);
router.get('/slug/:slug', optionalAuth, getCourseBySlug);
router.get('/:id', optionalAuth, getCourseById);

// Protected routes (authenticated users)
router.post('/:id/enroll', authMiddleware, enrollCourse);
router.get('/user/enrolled', authMiddleware, getEnrolledCourses);
router.post('/:id/review', authMiddleware, addCourseReview);
router.post('/progress', authMiddleware, updateModuleProgress);
router.get('/:courseId/progress', authMiddleware, getCourseProgress);

// Admin/Instructor routes
router.get('/admin/enrollments', authMiddleware, adminMiddleware, getAllEnrolledStudents);
router.post('/', authMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);

export default router;
