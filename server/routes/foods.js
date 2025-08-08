const express = require('express');
const Food = require('../models/Food');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all foods (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { available: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single food (public)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('createdBy', 'name');
    
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create food (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl } = req.body;

    const food = new Food({
      name,
      category,
      price,
      description,
      imageUrl,
      createdBy: req.user._id
    });

    await food.save();
    await food.populate('createdBy', 'name');

    res.status(201).json({
      message: 'Food created successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, available } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, category, price, description, imageUrl, available },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({
      message: 'Food updated successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
