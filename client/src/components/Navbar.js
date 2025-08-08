import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={isAuthenticated && isAdmin ? "/admin" : "/"} 
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🍽️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              FoodOrder
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
              >
                🏠 Home
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link 
                      to="/cart" 
                      className="relative text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                    >
                      🛒 Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/orders" 
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                    >
                      📋 Orders
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                    >
                      🎛️ Dashboard
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                    >
                      📋 Manage Orders
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    👋 Hello, <span className="text-blue-600">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  🚀 Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-700 hover:border-gray-700"
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {!isAdmin && (
                <Link 
                  to="/" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Home
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <>
                      <Link 
                        to="/cart" 
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Cart {cartItemCount > 0 && `(${cartItemCount})`}
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </>
                  )}
                  
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🎛️ Dashboard
                      </Link>
                      <Link 
                        to="/admin/add-food" 
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ➕ Add Food
                      </Link>
                      <Link 
                        to="/admin/orders" 
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📋 Manage Orders
                      </Link>
                    </>
                  )}
                  
                  <div className="px-3 py-2 text-gray-700">
                    Hello, {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
