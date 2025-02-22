import React from 'react';

const FoodCard = ({ item }) => {
  return (
    <div className="food-card">
      <img src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <button className="add-btn">Add to Cart</button>
    </div>
  );
};

export default FoodCard;