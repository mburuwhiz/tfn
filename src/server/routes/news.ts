import express from 'express';
import { News } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const newsItem = new News(req.body);
  try {
    const newNews = await newsItem.save();
    res.status(201).json(newNews);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNews);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News item deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
