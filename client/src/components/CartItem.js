import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(item._id, newQuantity);
    if (result.success) {
      toast.success(`Updated ${item.food.name} quantity! 📦`);
    } else {
      toast.error(result.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    const result = await removeFromCart(item._id);
    if (result.success) {
      toast.success(`Removed ${item.food.name} from cart! 🗑️`);
    } else {
      toast.error(result.message || 'Failed to remove item');
    }
  };

  const subtotal = item.food.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <img
        src={item.food.imageUrl || '/placeholder.svg?height=80&width=80&query=food'}
        alt={item.food.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.food.name}
        </h3>
        <p className="text-gray-600 capitalize">
          {item.food.category.replace('-', ' ')}
        </p>
        <p className="text-blue-600 font-semibold">
          ${item.food.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
        >
          +
        </button>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          ${subtotal.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
