// src/components/navbar.js
import React, { useState } from 'react';
import './navbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPortal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://sql12.freesqldatabase.com:3306/api/login', {
        email,
        password,
      });

      if (res.data.success) {
        const { user, role } = res.data;
        sessionStorage.setItem('userEmail', user.email);

        setPopupType('success');
        setPopupMessage('Login Successful!');

        setTimeout(() => {
          setPopupMessage('');
          setFadeOut(true); // Trigger fade out

          setTimeout(() => {
            if (role === 'admin') {
              navigate('/dashboard');
            } else if (role === 'user') {
              navigate('/userdashboard');
            }
          }, 500); // Wait for fadeOut before navigation
        }, 2000);
      } else {
        setPopupType('error');
        setPopupMessage(res.data.message || 'Invalid email or password');
        setTimeout(() => setPopupMessage(''), 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setPopupType('error');
      setPopupMessage('Login error. Please try again.');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  return (
    <div className={`login-portal ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-box">
        <form onSubmit={handleLogin}>
          {/* Logo at the top */}
          <div className="logo-container">
            <img src="/logo.png" alt="Powerhouse Ventures Logo" className="login-logo" />
          </div>

          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>

        {popupMessage && (
          <div className={`popup-message ${popupType}`}>
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPortal;
