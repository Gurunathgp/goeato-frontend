import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [vegItems, setVegItems] = useState([]);
  const [nonVegItems, setNonVegItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        console.log('Starting fetch for food items...');
        const response = await axios.get('http://localhost:5000/api/food-items');
        console.log('Fetched data:', response.data);
        const items = response.data;
        if (!Array.isArray(items)) {
          throw new Error('Fetched data is not an array');
        }
        setVegItems(items.filter(item => item.category === 'veg'));
        setNonVegItems(items.filter(item => item.category === 'non-veg'));
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to fetch food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  const sortItems = (items) => {
    if (sortOrder === 'low-to-high') {
      return [...items].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      return [...items].sort((a, b) => b.price - a.price);
    }
    return items;
  };

  const filteredVegItems = sortItems(
    vegItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || categoryFilter === 'veg')
    )
  );

  const filteredNonVegItems = sortItems(
    nonVegItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || categoryFilter === 'non-veg')
    )
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <img
        src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
        alt="Food Banner"
        className="banner-img"
        loading="lazy"
      />
      <h1>Order from GoEato</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-filter"
        >
          <option value="default">Sort by: Default</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>
      <div className="food-section">
        <h2>Veg Delights</h2>
        {filteredVegItems.length === 0 ? (
          <p>No veg items available.</p>
        ) : (
          <div className="food-container">
            {filteredVegItems.map(item => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
      <div className="food-section">
        <h2>Non-Veg Treats</h2>
        {filteredNonVegItems.length === 0 ? (
          <p>No non-veg items available.</p>
        ) : (
          <div className="food-container">
            {filteredNonVegItems.map(item => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;