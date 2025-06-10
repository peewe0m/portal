// src/pages/employee.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employee.css';

const Employee = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

  // Fetch employee data from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="employee-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="employee-table">
        <div className="table-header">
          <span>Employee no.</span>
          <span>Name</span>
          <span>Role</span>
        </div>
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="table-row">
            <span>{emp.id}</span>
            <span>{emp.name}</span>
            <span>{emp.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;
