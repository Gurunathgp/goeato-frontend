import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to fetch restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-detail">
      <button className="back-btn" onClick={() => navigate('/restaurants')}>
        ← Back to Restaurants
      </button>
      <h1>{restaurant.name}</h1>
      <div className="restaurant-info">
        <p><strong>Location:</strong> {restaurant.location}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      </div>
      <div className="food-section">
        <h2>Menu</h2>
        {restaurant.menu.length === 0 ? (
          <p>No items available.</p>
        ) : (
          <div className="food-container">
            {restaurant.menu.map(item => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;

