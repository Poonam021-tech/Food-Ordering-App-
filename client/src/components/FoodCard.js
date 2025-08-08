import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const FoodCard = ({ food }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart! 🔐');
      return;
    }

    const result = await addToCart(food._id);
    if (result.success) {
      toast.success(`${food.name} added to cart! 🛒`);
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'appetizer': 'bg-green-100 text-green-800',
      'main-course': 'bg-blue-100 text-blue-800',
      'dessert': 'bg-pink-100 text-pink-800',
      'beverage': 'bg-purple-100 text-purple-800',
      'snack': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'appetizer': '🥗',
      'main-course': '🍽️',
      'dessert': '🍰',
      'beverage': '🥤',
      'snack': '🍿'
    };
    return emojis[category] || '🍴';
  };

  return (
    <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <Link to={`/food/${food._id}`}>
        <div className="relative">
          <img
            src={food.imageUrl || '/placeholder.svg?height=200&width=300&query=food'}
            alt={food.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
              {getCategoryEmoji(food.category)} {food.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
              {food.name}
            </h3>
            <span className="text-xl font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              ${food.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
              {food.category.replace('-', ' ')}
            </span>
            
            {isAuthenticated && !isAdmin && (
              <button
                onClick={handleAddToCart}
                className="btn-primary text-sm py-1 px-3"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;
