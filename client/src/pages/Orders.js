import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
      if (response.data.length === 0) {
        toast.info('No orders found. Start ordering to see your history! 🍽️');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again later. 😞');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My Orders 📋
          </h1>
          <p className="text-lg text-gray-600">
            Track your delicious food orders and enjoy your meals! 🍽️
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                No Orders Yet!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Your order history will appear here once you start ordering delicious meals!
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Start Ordering 🚀
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, orderIndex) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Order #{order._id?.slice(-8) || 'Unknown'}
                      </h3>
                      <p className="text-white/90 text-lg">
                        📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Date not available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide ${getStatusColor(order.status || 'pending')} border-2 shadow-lg`}>
                        {order.status === 'pending' ? '⏳ Pending' :
                         order.status === 'confirmed' ? '✅ Confirmed' :
                         order.status === 'preparing' ? '👨‍🍳 Preparing' :
                         order.status === 'delivered' ? '🎉 Delivered' :
                         order.status === 'cancelled' ? '❌ Cancelled' :
                         '📋 ' + (order.status || 'pending')}
                      </span>
                      <div className="mt-3 text-right">
                        <span className="text-3xl font-bold text-white">💰 ${order.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center">
                        🍽️ <span className="ml-2">Items Ordered</span>
                      </h4>
                      <div className="space-y-4">
                        {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                          <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {item.quantity || 0}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-lg">
                                    {item.food?.name || 'Unknown Item'}
                                  </p>
                                  <p className="text-gray-600">
                                    ${(item.price || 0).toFixed(2)} each
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">
                                  ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center p-8">
                            <div className="text-4xl mb-2">🤔</div>
                            <p className="text-gray-500">No items found</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Details Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center">
                        🚚 <span className="ml-2">Delivery Details</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">📍</div>
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">Delivery Address</p>
                              <p className="text-gray-600 leading-relaxed">
                                {order.deliveryAddress || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">📞</div>
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">Contact Number</p>
                              <p className="text-gray-600">
                                {order.phoneNumber || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Progress */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">⏱️</div>
                            <div>
                              <p className="font-semibold text-gray-800">Order Progress</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`flex-1 h-1 ${order.status === 'confirmed' || order.status === 'preparing' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${order.status === 'preparing' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`flex-1 h-1 ${order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Ordered</span>
                            <span>Preparing</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Orders;
