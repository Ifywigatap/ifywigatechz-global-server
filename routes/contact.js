import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { validateContactForm } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateContactForm, createContact);
router.get('/', authMiddleware, adminMiddleware, getAllContacts);
router.get('/:id', authMiddleware, adminMiddleware, getContactById);
router.put('/:id', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

export default router;
