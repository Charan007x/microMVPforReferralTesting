import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  connectDB  from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();
import userRoutes from './routes/userRoutes.js';
import subscriptionRoutes from './routes/userSubscription.js';
import walletRoutes from './routes/walletRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', walletRoutes);

// Serve the frontend static files
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Fallback to index.html for unknown routes (SPA behavior)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
