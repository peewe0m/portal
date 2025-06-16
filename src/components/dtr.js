import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employee.css'; // Reuse existing styles
import { FaTrash, FaEdit } from 'react-icons/fa';

const DTR = () => {
  const [search, setSearch] = useState('');
  const [dtrs, setDtrs] = useState([]);
  const [selectedDTR, setSelectedDTR] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchDTRs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dtr');
      setDtrs(res.data);
    } catch (err) {
      console.error('Error fetching DTRs:', err);
    }
  };

  useEffect(() => {
    fetchDTRs();
  }, []);

  const fetchDTRDetails = async (id, openInEditMode = false) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/dtr/${id}`);
      setSelectedDTR(res.data);
      setModalVisible(true);
      setEditMode(openInEditMode);
    } catch (err) {
      console.error('Error fetching DTR details:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this DTR entry?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/dtr/${id}`);
      fetchDTRs();
      alert('DTR entry deleted successfully.');
    } catch (err) {
      console.error('Error deleting DTR:', err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/dtr/${selectedDTR.id}`, selectedDTR);
      fetchDTRs();
      setEditMode(false);
      alert('DTR updated.');
    } catch (err) {
      console.error('Error updating DTR:', err);
    }
  };

  const handleAdd = async () => {
    const employeeName = prompt('Enter employee name:');
    if (employeeName) {
      try {
        await axios.post('http://localhost:5000/api/dtr', {
          employee_name: employeeName,
        });
        fetchDTRs();
        alert('New DTR entry added.');
      } catch (err) {
        console.error('Error adding DTR:', err);
      }
    }
  };

  const filteredDTRs = dtrs.filter((dtr) =>
    dtr.employee_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="employee-page">
      <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search DTR by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>+ Add DTR</button>
      </div>

      <div className="employee-table">
        <div className="table-header" style={{ gridTemplateColumns: '0.5fr 2fr 0.5fr' }}>
          <span>ID</span>
          <span>Employee</span>
          <span>Action</span>
        </div>
        {filteredDTRs.map((dtr) => (
          <div key={dtr.id} className="table-row" style={{ gridTemplateColumns: '0.5fr 2fr 0.5fr' }}>
            <span>{dtr.id}</span>
            <span className="clickable-name" onClick={() => fetchDTRDetails(dtr.id)}>{dtr.employee_name}</span>
            <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FaEdit className="edit-icon" onClick={() => fetchDTRDetails(dtr.id, true)} title="Edit" />
              <FaTrash className="delete-icon" onClick={() => handleDelete(dtr.id)} title="Delete" />
            </span>
          </div>
        ))}
      </div>

      {modalVisible && selectedDTR && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>DTR Details</h2>
            <div className="modal-grid">
              <p><strong>ID:</strong> {selectedDTR.id}</p>
              <p><strong>Employee Name:</strong> {editMode ? (
                <input
                  type="text"
                  value={selectedDTR.employee_name || ''}
                  onChange={(e) =>
                    setSelectedDTR((prev) => ({ ...prev, employee_name: e.target.value }))
                  }
                />
              ) : (
                selectedDTR.employee_name
              )}</p>
            </div>
            <div className="modal-actions">
              {editMode ? (
                <>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setModalVisible(false)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DTR;
