import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants">
      <h1>Restaurants</h1>
      <div className="restaurant-list">
        {restaurants.map(restaurant => (
          <div
            key={restaurant._id}
            className="restaurant-card"
            onClick={() => navigate(`/restaurants/${restaurant._id}`)}
          >
            <div className="restaurant-img-container">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt={restaurant.name}
                className="restaurant-img"
                loading="lazy"
              />
            </div>
            <h2>{restaurant.name}</h2>
            <p><strong>Location:</strong> {restaurant.location}</p>
            <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            <p>{restaurant.menu.length} items</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;