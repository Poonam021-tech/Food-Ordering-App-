const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create order from cart
router.post('/', auth, async (req, res) => {
  try {
    console.log('Order request received from user:', req.user._id);
    console.log('Request body:', req.body);
    
    const { deliveryAddress, phoneNumber } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ customer: req.user._id })
      .populate('items.food');

    console.log('User cart found:', cart);

    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty or not found');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      food: item.food._id,
      quantity: item.quantity,
      price: item.food.price
    }));

    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      phoneNumber
    });

    await order.save();
    await order.populate('items.food customer', 'name email');

    // Clear cart after successful order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.food')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.food')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email').populate('items.food');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.food');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
