// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './pages/dashboard';
import Employee from './components/employee';
import UserDashboard from '../src/user/userdashboard'; // ✅ Add this import
import { useEffect } from 'react';

// Wrapper component to hide Navbar on dashboard routes
const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ['/dashboard', '/userdashboard']; // ✅ Add userdashboard here
  const hideNavbar = noNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<Home />} /> --> Removed */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Admin Dashboard */}
          <Route path="/userdashboard" element={<UserDashboard />} /> {/* User Dashboard */}
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
