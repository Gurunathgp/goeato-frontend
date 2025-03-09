import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail'; 
import Orders from './pages/Orders';
import Navbar from './components/navbar';
import { CartProvider } from './context/CartContext';

function App() {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  console.log('User from localStorage:', user);
  console.log('Is Admin:', isAdmin);

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} /> {/* Add this line */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
            {!isAdmin && <Route path="/admin" element={<h2>Access Denied</h2>} />}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;