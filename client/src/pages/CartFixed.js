import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CartFixed = () => {
  const { cart, clearCart, updateCartItem, removeFromCart } = useCart();
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

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const calculateTotal = () => {
    return (cart.items || []).reduce((total, item) => {
      if (item.food && item.food.price) {
        return total + (item.food.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!orderData.deliveryAddress || !orderData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Send only delivery information - backend will get cart from database
      const orderPayload = {
        deliveryAddress: orderData.deliveryAddress,
        phoneNumber: orderData.phoneNumber
      };

      const response = await api.post('/orders', orderPayload);
      
      if (response.data) {
        toast.success('Order placed successfully!');
        clearCart();
        setOrderData({ deliveryAddress: '', phoneNumber: '' });
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any delicious items to your cart yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and place your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white">Your Items ({(cart.items || []).length})</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {(cart.items || []).map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-6 bg-blue-50 border border-blue-100 rounded-xl hover:shadow-md hover:bg-blue-100 transition-all">
                    <img
                      src={item.food?.imageUrl || item.food?.image || '/placeholder.svg?height=200&width=300&query=food'}
                      alt={item.food?.name || 'Food item'}
                      className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg?height=200&width=300&query=food';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.food?.name || 'Unknown Item'}</h3>
                      <p className="text-gray-600">{item.food?.category || 'Food'}</p>
                      <p className="text-blue-600 font-bold text-lg">${item.food?.price || '0.00'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                      >
                        <span className="text-blue-600 font-bold">-</span>
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                      >
                        <span className="text-blue-600 font-bold">+</span>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        ${((item.food?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors hover:bg-red-50 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">$5.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${(calculateTotal() + 5).toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter your full delivery address..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={orderData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </form>

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartFixed;
