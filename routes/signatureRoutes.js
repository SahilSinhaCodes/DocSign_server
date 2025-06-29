import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { saveSignature } from '../controllers/signatureController.js';

const router = express.Router();

router.post('/save', protect, saveSignature);

export default router;
