import config from './config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/auth.js';
import planRoutes from './routes/plans.js';
import newsRoutes from './routes/news.js';
import galleryRoutes from './routes/gallery.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
mongoose.connect(config.mongodb_uri)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Drop problematic index if it exists
    try {
      const collections = await mongoose.connection.db?.listCollections().toArray();
      const ticketCollectionExists = collections?.some(col => col.name === 'tickets');
      if (ticketCollectionExists) {
        await mongoose.connection.db?.collection('tickets').dropIndex('ticketId_1');
        console.log('Successfully dropped ticketId_1 index');
      }
    } catch (err: any) {
      if (err.codeName !== 'IndexNotFound') {
        console.error('Error dropping index:', err.message);
      }
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static frontend files in production
const clientBuildPath = path.join(__dirname, '../../dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve the React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
