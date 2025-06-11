import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employee.css';
import { FaTrash } from 'react-icons/fa';

const Employee = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployeeDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
      setSelectedEmployee(res.data);
      setModalVisible(true);
    } catch (err) {
      console.error('Error fetching employee details:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
      alert('Employee deleted successfully.');
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${selectedEmployee.id}`, selectedEmployee);
      fetchEmployees();
      setEditMode(false);
      alert('Employee updated.');
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  const handleAdd = async () => {
    const name = prompt('Enter name of new employee:');
    const role = prompt('Enter role of new employee:');
    if (name && role) {
      try {
        await axios.post('http://localhost:5000/api/employees', {
          name,
          role,
        });
        fetchEmployees();
        alert('New employee added.');
      } catch (err) {
        console.error('Error adding employee:', err);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="employee-page">
      <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>+ Add Employee</button>
      </div>

      <div className="employee-table">
        <div className="table-header">
          <span>Employee no.</span>
          <span>Name</span>
          <span>Role</span>
          <span>Action</span>
        </div>
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="table-row">
            <span>{emp.id}</span>
            <span className="clickable-name" onClick={() => fetchEmployeeDetails(emp.id)}>
              {emp.name}
            </span>
            <span>{emp.role}</span>
            <span>
              <FaTrash
                className="delete-icon"
                onClick={() => handleDelete(emp.id)}
                title="Delete"
              />
            </span>
          </div>
        ))}
      </div>

      {modalVisible && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEmployee.complete_name}</h2>
            <div className="modal-grid">
              {Object.entries(selectedEmployee).map(([key, value]) => (
                <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {editMode ? (
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) =>
                      setSelectedEmployee((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    style={{ background: '#2c2c2c', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px' }}
                  />
                ) : (
                  value
                )}</p>
              ))}
            </div>
            <div className="modal-actions">
              {editMode ? (
                <>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={() => setModalVisible(false)}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
