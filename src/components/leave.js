import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './leave.css';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [modalContent, setModalContent] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://sql12.freesqldatabase.com:3306/api/leave-requests');
      setRequests(res.data);
      console.log('Fetched requests:', res.data); // Debug log
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const confirmMessage =
      newStatus === 'Approved'
        ? 'Are you sure you want to approve this leave request?'
        : 'Are you sure you want to decline this leave request?';

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await axios.put(`http://sql12.freesqldatabase.com:3306/api/leave-requests/${id}/status`, {
        status: newStatus,
      });
      fetchRequests(); // refresh data
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateRange = (from, to) => {
    if (!from || !to) return '';
    return `${formatDate(from)} – ${formatDate(to)}`;
  };

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return '';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(datetimeString).toLocaleString(undefined, options);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="leave-container">
      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Details</h3>
            <p>{modalContent}</p>
            <button onClick={() => setModalContent(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Filed At</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={req.id || index}>
                  <td>{req.id}</td>
                  <td>{req.company_email}</td>
                  <td>{req.name}</td>
                  <td>{req.leave_type}</td>

                  {/* Clickable Reason */}
                  <td
                    onClick={() => setModalContent(req.reason)}
                    className="clickable"
                    title="Click to view full reason"
                  >
                    {req.reason.length > 20 ? req.reason.slice(0, 20) + '...' : req.reason}
                  </td>

                  {/* Clickable Date Range */}
                  <td
                    onClick={() => setModalContent(formatDateRange(req.from_date, req.to_date))}
                    className="clickable"
                    title="Click to view full date range"
                  >
                    {formatDateRange(req.from_date, req.to_date)}
                  </td>

                  {/* Clickable Filed At */}
                  <td
                    onClick={() => setModalContent(formatDateTime(req.created_at))}
                    className="clickable"
                    title="Click to view full timestamp"
                  >
                    {formatDateTime(req.created_at)}
                  </td>

                  <td>
                    {req.attachment ? (
                      <a
                        href={`http://sql12.freesqldatabase.com:3306/uploads/${req.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      'None'
                    )}
                  </td>

                  <td className={`status ${req.status.toLowerCase()}`}>{req.status}</td>

                  <td>
                    {req.status === 'Pending' ? (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => updateStatus(req.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-decline"
                          onClick={() => updateStatus(req.id, 'Declined')}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'gray', fontStyle: 'italic' }}>
                        No actions available
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
