// src/components/EmployeeGrid.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employeegrid.css';

const EmployeeGrid = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://sql12.freesqldatabase.com:3306/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="employee-grid-container">
      {employees.map((emp, index) => {
        const imageUrl = `/${emp.full_name}.jpg`; // adjust for your format (.png etc.)
        return (
          <div className="employee-card" key={index}>
            <img src={imageUrl} alt={emp.full_name} className="employee-image" />
            <div className="employee-name">{emp.full_name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeGrid;
