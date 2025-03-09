import React from 'react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="food-card">
      <img src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default FoodCard;