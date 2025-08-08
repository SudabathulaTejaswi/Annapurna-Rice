import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.post('/:userId', async (req, res) => {
  const { items } = req.body;

  try {
    const updated = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

export default router; // ✅ ES Module export
