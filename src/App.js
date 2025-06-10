// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Employee from './components/employee'; // ✅ Import Employee
import { useEffect } from 'react';

// Wrapper component to handle conditional layout
const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<Employee />} /> {/* ✅ Add Employee route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
