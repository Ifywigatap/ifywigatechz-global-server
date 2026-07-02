import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  updateProduct,
  deleteProduct,
  addProductReview,
  getRelatedProducts,
  getFeaturedProducts,
  getSaleProducts
} from '../controllers/productController.js';
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/sale', getSaleProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected routes (authenticated users)
router.post('/:id/review', authMiddleware, addProductReview);

// Admin/Vendor routes
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
