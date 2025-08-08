// routes/orderRoutes.js

import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// CREATE order
router.post('/', async (req, res) => {
  const { userId, name, phone, address, items, total } = req.body;
  try {
    const order = await Order.create({
      userId,
      name,
      phone,
      address,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
});

// REORDER
// routes/orderRoutes.js or similar

router.post('/reorder/:orderId', async (req, res) => {
  try {
    const originalOrder = await Order.findById(req.params.orderId);
    if (!originalOrder) return res.status(404).json({ message: 'Original order not found' });

    const newOrder = new Order({
      userId: originalOrder.userId,
      name: originalOrder.name,
      phone: originalOrder.phone,
      address: originalOrder.address,
      items: req.body.items, // Contains name, product, quantity, price
      total: req.body.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: 'pending',
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating reorder:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// CANCEL order
router.put('/cancel/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get orders for specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
