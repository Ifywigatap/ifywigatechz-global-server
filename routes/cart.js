import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:productId', authMiddleware, updateCartItem); // For updating quantity
router.delete('/:productId', authMiddleware, removeCartItem);
router.delete('/', authMiddleware, clearCart);

export default router;
