import express from 'express';
import { Gallery } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const item = new Gallery(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
