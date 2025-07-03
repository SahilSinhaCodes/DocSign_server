import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { saveSignature, applySignature } from '../controllers/signatureController.js';

const router = express.Router();

router.post('/save', protect, saveSignature);
router.post('/save', protect, saveSignature);
router.post('/apply', protect, applySignature); // ⬅️ New route
export default router;