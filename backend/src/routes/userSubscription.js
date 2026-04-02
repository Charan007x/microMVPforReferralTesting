import express from 'express';
import { subscribeUser } from '../controllers/userSubscriptionController.js';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.js';
router.post('/subscribe', authenticateToken, subscribeUser);
export default router;