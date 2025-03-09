import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { 'x-auth-token': token },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();

    socket.on('orderUpdate', (data) => {
      if (data.userId === user.id) {
        setOrders((prevOrders) => [...prevOrders, data.order]);
      }
    });

    return () => socket.off('orderUpdate');
  }, [user]);

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Status:</strong> <span className={`status-${order.status}`}>{order.status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <h4>Items:</h4>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.foodItemId._id} className="order-item">
                    <h5>{item.foodItemId.name}</h5>
                    <p>Price: ₹{item.foodItemId.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;