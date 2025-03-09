import React from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to checkout');
      window.location.href = '/login';
      return;
    }

    try {
      const items = cart.map(item => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
      }));
      const total = calculateTotal();
      await axios.post('http://localhost:5000/api/orders', { items, total }, {
        headers: { 'x-auth-token': token },
      });
      alert('Order placed successfully!');
      clearCart();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.foodItemId} className="cart-item">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.foodItemId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.foodItemId, item.quantity + 1)}>+</button>
                </div>
                <p className="item-total">Total: ₹{item.price * item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.foodItemId)}>Remove</button>
              </div>
            ))}
          </div>
          <h3>Grand Total: ₹{calculateTotal()}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;