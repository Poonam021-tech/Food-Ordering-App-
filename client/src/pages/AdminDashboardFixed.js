import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboardFixed = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true
  });

  // Dashboard statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((total, order) => total + (order.totalAmount || 0), 0),
    totalFoods: foods.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodsResponse, ordersResponse] = await Promise.all([
        api.get('/foods'),
        api.get('/orders')
      ]);
      setFoods(foodsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data. Please check your admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Food management functions
  const handleFoodFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...foodForm,
        price: parseFloat(foodForm.price)
      };
      
      await api.post('/foods', formData);
      toast.success('Food item added successfully! 🎉');
      setShowAddForm(false);
      setFoodForm({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true
      });
      fetchData();
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item. Please try again. 😞');
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food._id);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      category: food.category,
      imageUrl: food.imageUrl,
      available: food.available
    });
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...foodForm,
        price: parseFloat(foodForm.price)
      };
      
      await api.put(`/foods/${editingFood}`, formData);
      toast.success('Food item updated successfully! 🎉');
      setEditingFood(null);
      setFoodForm({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true
      });
      fetchData();
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error('Failed to update food item. Please try again. 😞');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/foods/${foodId}`);
        toast.success('Food item deleted successfully! 🗑️');
        fetchData();
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item. Please try again. 😞');
      }
    }
  };

  const cancelEdit = () => {
    setEditingFood(null);
    setShowAddForm(false);
    setFoodForm({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      available: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                🎛️ Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>! 
                Here's what's happening with your restaurant.
              </p>
            </div>
            <div className="text-6xl">👨‍💼</div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">All time orders</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Total earnings</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Food Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalFoods}</p>
                <p className="text-xs text-gray-500 mt-1">Active menu items</p>
              </div>
              <div className="text-4xl">🍽️</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'foods', label: '🍕 Manage Foods', icon: '🍕' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Business Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🕒 Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">{order.customer?.name || 'Unknown Customer'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${(order.totalAmount || 0).toFixed(2)}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Items */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 Popular Items</h3>
                    <div className="space-y-3">
                      {foods.slice(0, 5).map((food) => (
                        <div key={food._id} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm border border-green-100">
                          <div className="flex items-center space-x-3">
                            <img src={food.imageUrl} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-gray-900">{food.name}</p>
                              <p className="text-sm text-gray-600">{food.category}</p>
                            </div>
                          </div>
                          <span className="text-green-600 font-semibold">${food.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Foods Tab */}
            {activeTab === 'foods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">🍕 Food Management</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    ➕ Add New Food
                  </button>
                </div>

                {/* Add/Edit Food Form */}
                {(showAddForm || editingFood) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {editingFood ? '✏️ Edit Food Item' : '➕ Add New Food Item'}
                    </h3>
                    <form onSubmit={editingFood ? handleUpdateFood : handleAddFood} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={foodForm.name}
                            onChange={handleFoodFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter food name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                          <select
                            name="category"
                            value={foodForm.category}
                            onChange={handleFoodFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            <option value="appetizer">Appetizer</option>
                            <option value="main-course">Main Course</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverage">Beverage</option>
                            <option value="snack">Snack</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                          <input
                            type="number"
                            name="price"
                            value={foodForm.price}
                            onChange={handleFoodFormChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                          <input
                            type="url"
                            name="imageUrl"
                            value={foodForm.imageUrl}
                            onChange={handleFoodFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                          name="description"
                          value={foodForm.description}
                          onChange={handleFoodFormChange}
                          required
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter food description"
                        ></textarea>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="available"
                          checked={foodForm.available}
                          onChange={handleFoodFormChange}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">Available for order</label>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                        >
                          {editingFood ? '💾 Update Food' : '➕ Add Food'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Food Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foods.map((food) => (
                    <div key={food._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                      <div className="relative">
                        <img 
                          src={food.imageUrl} 
                          alt={food.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {food.available ? '✅ Available' : '❌ Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{food.name}</h3>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                            {food.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-green-600">${food.price}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food._id)}
                            className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {foods.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No food items yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first food item to the menu</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      ➕ Add First Food Item
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Analytics & Reports</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Analytics */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Revenue Analytics</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Average Order Value</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Analytics */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Order Analytics</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.totalOrders > 0 ? 
                            ((orders.filter(o => o.status === 'delivered').length / stats.totalOrders) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardFixed;
