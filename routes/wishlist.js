import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addToWishlist);
router.delete('/:productId', authMiddleware, removeFromWishlist);

export default router;
