import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (foodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.foodItemId === foodItem._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.foodItemId === foodItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { foodItemId: foodItem._id, name: foodItem.name, price: foodItem.price, quantity: 1 }];
    });
  };

  const removeFromCart = (foodItemId) => {
    setCart((prevCart) => prevCart.filter(item => item.foodItemId !== foodItemId));
  };

  const updateQuantity = (foodItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
    } else {
      setCart((prevCart) =>
        prevCart.map(item =>
          item.foodItemId === foodItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);