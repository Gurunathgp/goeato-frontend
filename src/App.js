import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/home'; // Updated from './pages/Home'
import Login from './pages/login'; // Updated from './pages/Login'
import Signup from './pages/signup'; // Updated from './pages/Signup'
import Navbar from './components/navbar'; // Updated from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
