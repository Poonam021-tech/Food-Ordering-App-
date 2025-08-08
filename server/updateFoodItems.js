const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Food = require('./models/Food');
const User = require('./models/User');

// Enhanced sample food items with better images and more variety
const enhancedFoods = [
  // APPETIZERS
  {
    name: 'Garlic Bread',
    category: 'appetizer',
    price: 4.99,
    description: 'Crispy toasted bread with fresh garlic butter, herbs and parmesan cheese',
    imageUrl: 'https://images.unsplash.com/photo-1619985632461-f33748ef8681?w=500&h=400&fit=crop'
  },
  {
    name: 'Buffalo Wings',
    category: 'appetizer',
    price: 8.99,
    description: 'Spicy chicken wings served with blue cheese dip and celery sticks',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=400&fit=crop'
  },
  {
    name: 'Mozzarella Sticks',
    category: 'appetizer',
    price: 6.99,
    description: 'Golden fried mozzarella cheese sticks with marinara sauce',
    imageUrl: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=500&h=400&fit=crop'
  },
  {
    name: 'Onion Rings',
    category: 'appetizer',
    price: 5.99,
    description: 'Crispy beer-battered onion rings with ranch dipping sauce',
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop'
  },
  {
    name: 'Nachos Supreme',
    category: 'appetizer',
    price: 9.99,
    description: 'Loaded nachos with cheese, jalapeños, sour cream, and guacamole',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop'
  },

  // MAIN COURSES
  {
    name: 'Classic Cheeseburger',
    category: 'main-course',
    price: 11.99,
    description: 'Juicy beef patty with cheese, lettuce, tomato, onion, and special sauce',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'
  },
  {
    name: 'Grilled Salmon',
    category: 'main-course',
    price: 16.99,
    description: 'Fresh Atlantic salmon grilled to perfection with lemon butter sauce',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop'
  },
  {
    name: 'Fish Tacos',
    category: 'main-course',
    price: 11.99,
    description: 'Grilled fish with cabbage slaw, avocado, and lime crema in soft tortillas',
    imageUrl: 'https://images.unsplash.com/photo-1599974624618-8b3e81dfaaa4?w=500&h=400&fit=crop'
  },
  {
    name: 'BBQ Ribs',
    category: 'main-course',
    price: 18.99,
    description: 'Tender pork ribs with our signature BBQ sauce and coleslaw',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop'
  },
  {
    name: 'Chicken Alfredo Pasta',
    category: 'main-course',
    price: 13.99,
    description: 'Creamy alfredo pasta with grilled chicken and parmesan cheese',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop'
  },
  {
    name: 'Steak & Fries',
    category: 'main-course',
    price: 22.99,
    description: 'Premium sirloin steak cooked to your preference with crispy fries',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop'
  },
  {
    name: 'Vegetarian Burrito',
    category: 'main-course',
    price: 9.99,
    description: 'Black beans, rice, peppers, cheese, and fresh vegetables wrapped in a tortilla',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop'
  },

  // DESSERTS
  {
    name: 'Cheesecake',
    category: 'dessert',
    price: 6.99,
    description: 'Creamy New York style cheesecake with berry compote',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop'
  },
  {
    name: 'Ice Cream Sundae',
    category: 'dessert',
    price: 4.99,
    description: 'Vanilla ice cream with chocolate sauce, whipped cream, and cherry',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop'
  },
  {
    name: 'Apple Pie',
    category: 'dessert',
    price: 5.99,
    description: 'Traditional apple pie with cinnamon and vanilla ice cream',
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&h=400&fit=crop'
  },
  {
    name: 'Tiramisu',
    category: 'dessert',
    price: 7.99,
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop'
  },

  // BEVERAGES
  {
    name: 'Fresh Orange Juice',
    category: 'beverage',
    price: 3.99,
    description: 'Freshly squeezed orange juice packed with vitamin C',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=400&fit=crop'
  },
  {
    name: 'Craft Beer',
    category: 'beverage',
    price: 4.99,
    description: 'Local craft beer on tap - ask for todays selection',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=400&fit=crop'
  },
  {
    name: 'Milkshake',
    category: 'beverage',
    price: 5.99,
    description: 'Thick and creamy milkshake - chocolate, vanilla, or strawberry',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=400&fit=crop'
  },
  {
    name: 'Green Tea',
    category: 'beverage',
    price: 2.99,
    description: 'Premium green tea with antioxidants and natural flavor',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=400&fit=crop'
  },
  {
    name: 'Lemonade',
    category: 'beverage',
    price: 3.49,
    description: 'Fresh squeezed lemonade with mint and ice',
    imageUrl: 'https://images.unsplash.com/photo-1523371683702-b5ff336fd2cc?w=500&h=400&fit=crop'
  },

  // SNACKS
  {
    name: 'French Fries',
    category: 'snack',
    price: 3.99,
    description: 'Golden crispy french fries with sea salt',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop'
  },
  {
    name: 'Chicken Nuggets',
    category: 'snack',
    price: 6.99,
    description: '8-piece crispy chicken nuggets with your choice of dipping sauce',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=400&fit=crop'
  },
  {
    name: 'Loaded Potato Skins',
    category: 'snack',
    price: 7.99,
    description: 'Crispy potato skins loaded with bacon, cheese, and green onions',
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&h=400&fit=crop'
  },
  {
    name: 'Pretzel Bites',
    category: 'snack',
    price: 5.99,
    description: 'Warm pretzel bites with cheese sauce and mustard dip',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop'
  }
];

async function updateFoodItems() {
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

    // Clear existing food items
    await Food.deleteMany({});
    console.log('🗑️ Cleared existing food items');

    // Add createdBy field to each food item
    const foodsWithCreator = enhancedFoods.map(food => ({
      ...food,
      createdBy: admin._id
    }));

    // Insert enhanced food items
    const result = await Food.insertMany(foodsWithCreator);
    
    console.log(`✅ Successfully added ${result.length} enhanced food items!`);
    
    // Group by category for better display
    const categories = ['appetizer', 'main-course', 'dessert', 'beverage', 'snack'];
    
    categories.forEach(category => {
      const categoryItems = result.filter(food => food.category === category);
      if (categoryItems.length > 0) {
        console.log(`\n🍴 ${category.toUpperCase()}S (${categoryItems.length} items):`);
        categoryItems.forEach(food => {
          console.log(`   - ${food.name} - $${food.price}`);
        });
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating food items:', error.message);
    process.exit(1);
  }
}

updateFoodItems();
