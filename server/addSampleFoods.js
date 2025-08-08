const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Food = require('./models/Food');
const User = require('./models/User');

// Sample food items
const sampleFoods = [
  {
    name: 'Margherita Pizza',
    category: 'main-course',
    price: 12.99,
    description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil leaves',
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500'
  },
  {
    name: 'Chicken Burger',
    category: 'main-course',
    price: 9.99,
    description: 'Juicy grilled chicken breast with lettuce, tomato, and mayo in a sesame bun',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
  },
  {
    name: 'Caesar Salad',
    category: 'appetizer',
    price: 7.99,
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'
  },
  {
    name: 'Chocolate Cake',
    category: 'dessert',
    price: 5.99,
    description: 'Rich and moist chocolate cake with chocolate frosting',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
  },
  {
    name: 'Iced Coffee',
    category: 'beverage',
    price: 3.99,
    description: 'Cold brew coffee served over ice with a splash of milk',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500'
  },
  {
    name: 'Fish Tacos',
    category: 'main-course',
    price: 11.99,
    description: 'Grilled fish with cabbage slaw and lime crema in soft tortillas',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500'
  },
  {
    name: 'Fruit Smoothie',
    category: 'beverage',
    price: 4.99,
    description: 'Fresh mixed fruit smoothie with yogurt and honey',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500'
  },
  {
    name: 'Garlic Bread',
    category: 'appetizer',
    price: 4.99,
    description: 'Toasted bread with garlic butter and herbs',
    imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500'
  }
];

async function addSampleFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user to set as creator
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Check if foods already exist
    const existingFoods = await Food.countDocuments();
    if (existingFoods > 0) {
      console.log(`📦 ${existingFoods} food items already exist in the database.`);
      process.exit(0);
    }

    // Add createdBy field to each food item
    const foodsWithCreator = sampleFoods.map(food => ({
      ...food,
      createdBy: admin._id
    }));

    // Insert sample foods
    const result = await Food.insertMany(foodsWithCreator);
    
    console.log(`✅ Successfully added ${result.length} food items!`);
    console.log('🍕 Food items added:');
    result.forEach(food => {
      console.log(`   - ${food.name} (${food.category}) - $${food.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding food items:', error.message);
    process.exit(1);
  }
}

addSampleFoods();
