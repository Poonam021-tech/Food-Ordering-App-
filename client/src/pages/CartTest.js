import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CartTest = () => {
  const { cart, clearCart, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    phoneNumber: ''
  });

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(itemId, newQuantity);
    if (result.success) {
      toast.success('Quantity updated! 📦');
    } else {
      toast.error(result.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId, itemName) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success(`Removed ${itemName} from cart! 🗑️`);
    } else {
      toast.error(result.message || 'Failed to remove item');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place an order! 🔐');
      return;
    }
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty! 🛒');
      return;
    }

    if (!orderData.deliveryAddress || !orderData.phoneNumber) {
      toast.error('Please fill in all required fields! 📝');
      return;
    }

    setLoading(true);
    
    try {
      const orderPayload = {
        items: cart.items.map(item => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.food.price
        })),
        totalAmount: cart.totalAmount + 5, // Include delivery fee
        deliveryAddress: orderData.deliveryAddress,
        phoneNumber: orderData.phoneNumber
      };

      await api.post('/orders', orderPayload);
      clearCart();
      toast.success('Order placed successfully! 🎉 Check your orders page for updates.');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again. 😞');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = await clearCart();
      if (result.success) {
        toast.success('Cart cleared! 🛒');
      } else {
        toast.error(result.message || 'Failed to clear cart');
      }
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
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
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ${(item.food.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item._id, item.food.name)}
                  className="text-red-500 hover:text-red-700 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})</span>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(cart.totalAmount + 5).toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                name="deliveryAddress"
                value={orderData.deliveryAddress}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={orderData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartTest;
