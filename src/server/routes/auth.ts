import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
