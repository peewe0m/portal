// src/components/navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './navbar.css';
import axios from 'axios';

const Navbar = () => {
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginBoxRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const toggleLoginBox = () => setShowLoginBox((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginBoxRef.current && !loginBoxRef.current.contains(event.target)) {
        setShowLoginBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      if (res.data.success) {
        alert("Login successful!");
        setShowLoginBox(false);

        // ✅ Redirect to dashboard
        navigate('/dashboard');
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (error) {
      alert("Login error");
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-buttons">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/machines">Machines</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <button onClick={toggleLoginBox} className="login-toggle-btn">Login</button>
          {showLoginBox && (
            <div ref={loginBoxRef} className="login-box">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <button type="submit" className="submit-btn">Login</button>
              </form>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
