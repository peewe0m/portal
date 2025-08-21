import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './userdashboard.css';
import axios from 'axios';

const UserDashboard = () => {
  const [activePanel, setActivePanel] = useState('Employee');
  const [userData, setUserData] = useState(null);
  const [dtrData, setDtrData] = useState([]);
  const [leaveFromDate, setLeaveFromDate] = useState('');
  const [leaveToDate, setLeaveToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      navigate('/');
      return;
    }

    axios.get('http://localhost:5000/api/employees')
      .then((res) => {
        const matched = res.data.find(emp => emp.company_email === userEmail);
        setUserData(matched || null);
      })
      .catch((err) => console.error('Failed to fetch user data:', err));

    axios.get('http://localhost:5000/api/dtr')
      .then((res) => {
        const filtered = res.data.filter(entry => entry.company_email === userEmail);
        setDtrData(filtered);
      })
      .catch((err) => console.error('Failed to fetch DTR data:', err));

    fetchLeaveHistory();
  }, [userEmail]);

  const fetchLeaveHistory = () => {
    axios.get(`http://localhost:5000/api/leave?email=${encodeURIComponent(userEmail)}`)
      .then((res) => {
        setLeaveHistory(res.data);
      })
      .catch((err) => console.error('Failed to fetch leave history:', err));
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();

    if (!userData || !userData.id) {
      alert('User data not found. Please try again later.');
      return;
    }

    const formData = new FormData();
    formData.append('email', userData.company_email);
    formData.append('name', userData.name);
    formData.append('leaveType', leaveType);
    formData.append('reason', reason);
    formData.append('from_date', leaveFromDate);
    formData.append('to_date', leaveToDate);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    axios.post('http://localhost:5000/api/leave', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(() => {
      setShowModal(true);
      setLeaveFromDate('');
      setLeaveToDate('');
      setLeaveType('');
      setReason('');
      setAttachment(null);
      fetchLeaveHistory();
    }).catch((err) => {
      console.error('Failed to submit leave request:', err);
      alert('Leave submission failed.');
    });
  };

  const buttons = ['Employee', 'Daily Time Record', 'File Leave', 'Biometrics', 'Logout'];

  const handleButtonClick = (btn) => {
    if (btn === 'Logout') {
      sessionStorage.clear();
      navigate('/');
    } else {
      setActivePanel(btn);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'Employee':
        return (
          <div className="main-panel">
            {userData && (
              <div className="profile-header">
                <img
                  src={`/${userData.id}.jpg`}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/1.png';
                  }}  
                />
                <div className="profile-info">
                  <h1 className="profile-name">{userData.name}</h1>
                  <h3 className="profile-position">{userData.role}</h3>
                </div>
              </div>
            )}
            {userData ? (
              <table className="employee-table">
                <tbody>
                  {Object.entries(userData).map(([key, value]) => {
                    let displayKey = key;
                    if (key === 'id') displayKey = 'Employee Number';
                    else if (key === 'name') displayKey = 'Complete Name';
                    else if (key === 'role') displayKey = 'Position';
                    else displayKey = key.replace(/_/g, ' ');

                    return (
                      <tr key={key}>
                        <th>{displayKey}</th>
                        <td>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>Loading your profile...</p>
            )}
          </div>
        );

      case 'Daily Time Record':
        return (
          <div className="main-panel">
            <h2>Daily Time Record</h2>
            {dtrData.length > 0 ? (
              <ul>
                {dtrData.map((entry) => (
                  <li key={entry.id}><strong>{entry.employee_name}</strong></li>
                ))}
              </ul>
            ) : (
              <p>No DTR records found.</p>
            )}
          </div>
        );

      case 'File Leave':
        return (
          <div className="main-panel leave-panel">
            <h2 className="panel-title">Leave Filing Form</h2>
            <form onSubmit={handleLeaveSubmit} className="leave-form" encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="leaveFromDate">Leave From</label>
                <input
                  type="date"
                  id="leaveFromDate"
                  value={leaveFromDate}
                  onChange={(e) => setLeaveFromDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="leaveToDate">Leave To</label>
                <input
                  type="date"
                  id="leaveToDate"
                  value={leaveToDate}
                  onChange={(e) => setLeaveToDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="leaveType">Leave Type</label>
                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Select Leave Type --</option>
                  <option value="Sick Leave and Vacation Leave (No Pay)">Sick Leave and Vacation Leave (No Pay)</option>
                  <option value="Sick Leave and Vacation Leave">Sick Leave and Vacation Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  placeholder="Enter your reason for filing leave..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="attachment">Attachment (optional)</label>
                <input
                  type="file"
                  id="attachment"
                  onChange={(e) => setAttachment(e.target.files[0])}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </div>

              <div className="form-actions">
                <button type="submit">Submit Request</button>
              </div>
            </form>

            {showModal && (
              <div className="confirmation-modal">
                <div className="modal-content">
                  <p>✅ Leave request submitted successfully!</p>
                  <button onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            )}

            <h3 className="panel-subtitle">Filed Leave History</h3>
            {leaveHistory.length > 0 ? (
              <table className="leave-history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Dates</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>
                        {formatDate(entry.from_date)} - {formatDate(entry.to_date)}
                      </td>
                      <td>{entry.leave_type}</td>
                      <td>{entry.reason}</td>
                      <td>
                        <span className={`status-badge ${entry.status.toLowerCase()}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td>
                        {entry.attachment ? (
                          <a
                            href={`http://localhost:5000/uploads/${entry.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No leave requests filed yet.</p>
            )}
          </div>
        );

      case 'Biometrics':
        return <div className="main-panel">Biometrics Panel (Coming Soon)</div>;

      default:
        return <div className="main-panel">Select a panel</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`sidebar-button ${activePanel === btn ? 'active' : ''}`}
            >
              {btn}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">© 2025 Powerhouse</div>
      </aside>

      <main className="main-content">
        {renderPanel()}
      </main>
    </div>
  );
};

export default UserDashboard;
