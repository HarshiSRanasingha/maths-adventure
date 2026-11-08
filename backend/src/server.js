import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Maths Adventure API is running.' });
});

const port = process.env.PORT || 5000;

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    }
  } else {
    console.log('MONGODB_URI not set; starting API without database connection.');
  }

  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
}

start();
