import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({ name: '', price: 0, img: '', category: 'veg', restaurantId: '' });
  const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '', cuisine: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const [foodItemsRes, restaurantsRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/food-items', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/restaurants', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/orders', { headers: { 'x-auth-token': token } }),
        ]);
        setFoodItems(foodItemsRes.data);
        setRestaurants(restaurantsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    socket.on('orderUpdate', (data) => {
      setOrders((prevOrders) => [...prevOrders, data.order]);
    });

    return () => socket.off('orderUpdate');
  }, [token]);

  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/restaurants/${newFoodItem.restaurantId}/menu`, newFoodItem, {
        headers: { 'x-auth-token': token },
      });
      setFoodItems([...foodItems, response.data]);
      setNewFoodItem({ name: '', price: 0, img: '', category: 'veg', restaurantId: '' });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleEditFoodItem = (item) => {
    setEditingItem(item);
    setNewFoodItem({
      name: item.name,
      price: item.price,
      img: item.img,
      category: item.category,
      restaurantId: item.restaurantId,
    });
  };

  const handleUpdateFoodItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/food-items/${editingItem._id}`, newFoodItem, {
        headers: { 'x-auth-token': token },
      });
      setFoodItems(foodItems.map(item => (item._id === editingItem._id ? response.data : item)));
      setEditingItem(null);
      setNewFoodItem({ name: '', price: 0, img: '', category: 'veg', restaurantId: '' });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/food-items/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setFoodItems(foodItems.filter(item => item._id !== id));
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/restaurants', newRestaurant, {
        headers: { 'x-auth-token': token },
      });
      setRestaurants([...restaurants, response.data]);
      setNewRestaurant({ name: '', location: '', cuisine: '' });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
        headers: { 'x-auth-token': token },
      });
      setOrders(orders.map(order => (order._id === orderId ? { ...order, status: newStatus } : order)));
      socket.emit('orderUpdate', { userId: orders.find(o => o._id === orderId).userId, order: { ...orders.find(o => o._id === orderId), status: newStatus } });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order.');
      return;
    }
    try {
      await Promise.all(selectedOrders.map(orderId =>
        axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
          headers: { 'x-auth-token': token },
        })
      ));
      setOrders(orders.map(order => selectedOrders.includes(order._id) ? { ...order, status: newStatus } : order));
      selectedOrders.forEach(orderId => {
        socket.emit('orderUpdate', { userId: orders.find(o => o._id === orderId).userId, order: { ...orders.find(o => o._id === orderId), status: newStatus } });
      });
      setSelectedOrders([]);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Add/Edit Food Item */}
      <div className="admin-section">
        <h3>{editingItem ? 'Edit Food Item' : 'Add Food Item'}</h3>
        <form onSubmit={editingItem ? handleUpdateFoodItem : handleAddFoodItem}>
          <input
            type="text"
            placeholder="Name"
            value={newFoodItem.name}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newFoodItem.price}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, price: Number(e.target.value) })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newFoodItem.img}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, img: e.target.value })}
            required
          />
          <select
            value={newFoodItem.category}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, category: e.target.value })}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
          <select
            value={newFoodItem.restaurantId}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, restaurantId: e.target.value })}
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
            ))}
          </select>
          <button type="submit">{editingItem ? 'Update Food Item' : 'Add Food Item'}</button>
          {editingItem && (
            <button type="button" className="cancel-btn" onClick={() => {
              setEditingItem(null);
              setNewFoodItem({ name: '', price: 0, img: '', category: 'veg', restaurantId: '' });
            }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* List Food Items */}
      <div className="admin-section">
        <h3>Food Items</h3>
        <div className="food-container">
          {foodItems.map(item => (
            <div key={item._id} className="food-card-admin">
              <img src={item.img} alt={item.name} loading="lazy" />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <div className="admin-actions">
                <button onClick={() => handleEditFoodItem(item)} className="edit-btn">Edit</button>
                <button onClick={() => handleDeleteFoodItem(item._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Restaurant */}
      <div className="admin-section">
        <h3>Add Restaurant</h3>
        <form onSubmit={handleAddRestaurant}>
          <input
            type="text"
            placeholder="Name"
            value={newRestaurant.name}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newRestaurant.location}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={newRestaurant.cuisine}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
            required
          />
          <button type="submit">Add Restaurant</button>
        </form>
      </div>

      {/* List Restaurants */}
      <div className="admin-section">
        <h3>Restaurants</h3>
        <div className="restaurant-list-admin">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card-admin">
              <h4>{restaurant.name}</h4>
              <p><strong>Location:</strong> {restaurant.location}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <button onClick={() => handleDeleteRestaurant(restaurant._id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* List Orders */}
      <div className="admin-section">
        <h3>All Orders</h3>
        {selectedOrders.length > 0 && (
          <div className="bulk-actions">
            <select
              onChange={(e) => handleBulkUpdateStatus(e.target.value)}
              className="bulk-status-select"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={() => setSelectedOrders([])} className="clear-selection-btn">
              Clear Selection
            </button>
          </div>
        )}
        <div className="order-list-admin">
          {orders.map(order => (
            <div key={order._id} className="order-card-admin">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order._id)}
                onChange={() => toggleOrderSelection(order._id)}
              />
              <h4>Order ID: {order._id}</h4>
              <p><strong>User ID:</strong> {order.userId}</p>
              <p><strong>Status:</strong> <span className={`status-${order.status}`}>{order.status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <h5>Items:</h5>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.foodItemId._id} className="order-item">
                    <h6>{item.foodItemId.name}</h6>
                    <p>Price: ₹{item.foodItemId.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;