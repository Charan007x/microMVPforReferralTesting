import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  connectDB  from './config/db.js';
dotenv.config();
connectDB();
import userRoutes from './routes/userRoutes.js';
import subscriptionRoutes from './routes/userSubscription.js';
import walletRoutes from './routes/walletRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', walletRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
