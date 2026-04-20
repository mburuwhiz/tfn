import express from 'express';
import { SubscriptionPlan } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create plan (Protected)
router.post('/', authMiddleware, async (req, res) => {
  const plan = new SubscriptionPlan(req.body);
  try {
    const newPlan = await plan.save();
    res.status(201).json(newPlan);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update plan (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlan);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete plan (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await SubscriptionPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
