// src/pages/employee.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employee.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Employee = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', role: '' });

  // 🔹 new states for Files modal
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(fetchEmployees, 60000); // auto-refresh every 1 minute
    return () => clearInterval(interval);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://sql12.freesqldatabase.com:3306/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchEmployeeDetails = async (id, openInEditMode = false) => {
    try {
      const res = await axios.get(`http://sql12.freesqldatabase.com:3306/api/employees/${id}`);
      setSelectedEmployee(res.data);
      setModalVisible(true);
      setEditMode(openInEditMode);
    } catch (err) {
      console.error('Error fetching employee details:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://sql12.freesqldatabase.com:3306/api/employees/${id}`);
      fetchEmployees();
      setModalVisible(false);
      alert('Employee deleted successfully.');
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee.');
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://sql12.freesqldatabase.com:3306/api/employees/${selectedEmployee.id}`, selectedEmployee);
      fetchEmployees();
      setEditMode(false);
      alert('Employee updated.');
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  const handleAddEmployee = async () => {
    const { id, name, role } = newEmployee;
    if (id && name && role) {
      try {
        await axios.post('http://sql12.freesqldatabase.com:3306/api/employees', newEmployee);
        fetchEmployees();
        setAddModalVisible(false);
        setNewEmployee({ id: '', name: '', role: '' });
        alert('New employee added.');
      } catch (err) {
        console.error('Error adding employee:', err);
        alert('Failed to add employee. Check if ID is unique.');
      }
    } else {
      alert('All fields (ID, Name, Role) are required.');
    }
  };

  const handleJDUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedEmployee) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', selectedEmployee.id); // ✅ FIXED: use consistent key

    try {
      await axios.post('http://sql12.freesqldatabase.com:3306/api/employees/upload-jd', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Job Description uploaded.');
      fetchFiles(selectedEmployee.id); // ✅ refresh file list after upload
    } catch (err) {
      console.error('Error uploading JD:', err);
      alert('Failed to upload JD.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedEmployee) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('employeeId', selectedEmployee.id); // ✅ keep consistent

    try {
      await axios.post('http://sql12.freesqldatabase.com:3306/api/employees/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Image uploaded.');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image.');
    }
  };

  // 🔹 fetch files for selected employee
  const fetchFiles = async (id) => {
    try {
      const res = await axios.get(`http://sql12.freesqldatabase.com:3306/api/employees/${id}/files`);
      setFiles(res.data);
      setFilesModalVisible(true);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return isNaN(date) ? value : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.name || '').toLowerCase().includes(search.toLowerCase())
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

      {/* Grid Card Display */}
      <div className="employee-grid big-cards">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card big" onClick={() => fetchEmployeeDetails(emp.id)}>
            <img
              src={`/${emp.id}.jpg`}
              alt={emp.name}
              onError={(e) => (e.target.src = '/1.png')}
              className="employee-image big"
            />
            <div className="employee-name">{emp.name}</div>
            <div className="employee-role">{emp.role}</div>
          </div>
        ))}

        {/* Add Employee Card */}
        <div className="employee-card add-card big" onClick={() => setAddModalVisible(true)}>
          <div className="employee-add-icon">+</div>
          <div className="employee-name">Add Employee</div>
        </div>
      </div>

      {/* View/Edit Modal */}
      {modalVisible && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img
                src={`/${selectedEmployee.id}.jpg`}
                alt="Employee"
                className="modal-photo"
                onError={(e) => { e.target.onerror = null; e.target.src = '/1.png'; }}
              />
              <div className="modal-info">
                <div className="modal-name">{selectedEmployee.name || 'Unnamed'}</div>
                <div className="modal-role">{selectedEmployee.role || 'Unknown Role'}</div>
              </div>
            </div>

            <div className="modal-grid">
              {Object.entries(selectedEmployee).map(([key, value]) => (
                key !== 'photo' && key !== 'name' && key !== 'role' && (
                  <div className="modal-field" key={key}>
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:</strong>
                    {editMode ? (
                      <input
                        type="text"
                        value={value || ''}
                        onChange={(e) =>
                          setSelectedEmployee((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    ) : (
                      <span>
                        {['birth_date', 'hired_date', 'end_date'].includes(key)
                          ? formatDate(value)
                          : value || '-'}
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>

            <div className="modal-actions">
              {editMode ? (
                <>
                  <label className="styled-upload-button">
                    Add Image
                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                  </label>
                  <label className="styled-upload-button">
                    Upload JD
                    <input type="file" hidden onChange={handleJDUpload} accept=".pdf" />
                  </label>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditMode(true)}><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(selectedEmployee.id)}><FaTrash /> Delete</button>
                  {/* 🔹 Per-employee files button */}
                  <button onClick={() => fetchFiles(selectedEmployee.id)}>Files</button>
                  <button onClick={() => setModalVisible(false)}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Files Modal */}
      {filesModalVisible && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setFilesModalVisible(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEmployee.name}'s Files</h2>
            <div className="files-grid">
              {files.length > 0 ? (
                files.map((file, idx) => (
                  <div key={idx} className="file-card">
                    <a
                      href={`/jdfiles/${selectedEmployee.id}/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 {file}
                    </a>
                  </div>
                ))
              ) : (
                <p>No files found.</p>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setFilesModalVisible(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {addModalVisible && (
        <div className="modal-overlay" onClick={() => setAddModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Employee</h2>
            <div className="modal-grid">
              <div className="modal-field">
                <strong>ID:</strong>
                <input
                  type="text"
                  value={newEmployee.id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <strong>Name:</strong>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <strong>Role:</strong>
                <input
                  type="text"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddEmployee}>Add</button>
              <button onClick={() => setAddModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
