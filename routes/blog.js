import express from 'express';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  addComment
} from '../controllers/blogController.js';
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createBlogPost);
router.get('/', optionalAuth, getAllBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.put('/:id', authMiddleware, updateBlogPost);
router.delete('/:id', authMiddleware, deleteBlogPost);
router.post('/:id/like', authMiddleware, likeBlogPost);
router.post('/:id/comments', authMiddleware, addComment);

export default router;
