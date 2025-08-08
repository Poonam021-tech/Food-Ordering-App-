import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartSimple = () => {
  const { cart } = useCart();
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div>
        <p>User: {user?.name || 'Not logged in'}</p>
        <p>Cart items: {cart?.items?.length || 0}</p>
        <p>Total: ${cart?.totalAmount?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export default CartSimple;
