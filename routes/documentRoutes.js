import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import protect from '../middleware/authMiddleware.js';
import {
  uploadDocument,
  getMyDocuments,
  deleteDocument, // 👈 import this
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/my-docs', protect, getMyDocuments);
router.delete('/:id', protect, deleteDocument); // 👈 add this

export default router;
