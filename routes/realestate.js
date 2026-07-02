import { Router } from 'express';
import { getProperties, getProperty, postProperty, updateProperty, deleteProperty } from '../controllers/realestateController.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', authMiddleware, postProperty);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

export default router;
