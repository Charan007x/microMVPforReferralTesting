import express from "express"
const router = express.Router();
import { getWallet } from "../controllers/walletController.js";
import { authenticateToken } from "../middleware/auth.js";
router.get('/wallet',authenticateToken, getWallet);
export default router;