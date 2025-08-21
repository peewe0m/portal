import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dtr.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const DTR = () => {
  const [search, setSearch] = useState("");
  const [dtrs, setDtrs] = useState([]);
  const [selectedDTR, setSelectedDTR] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchDTRs = async () => {
    try {
      const res = await axios.get("http://sql12.freesqldatabase.com:3306/api/dtr");
      setDtrs(res.data);
    } catch (err) {
      console.error("Error fetching DTRs:", err);
    }
  };

  useEffect(() => {
    fetchDTRs();
  }, []);

  const fetchDTRDetails = async (id, openInEditMode = false) => {
    try {
      const res = await axios.get(`http://sql12.freesqldatabase.com:3306/api/dtr/${id}`);
      setSelectedDTR(res.data);
      setModalVisible(true);
      setEditMode(openInEditMode);
    } catch (err) {
      console.error("Error fetching DTR details:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this DTR entry?"))
      return;
    try {
      await axios.delete(`http://sql12.freesqldatabase.com:3306/api/dtr/${id}`);
      fetchDTRs();
      alert("DTR entry deleted successfully.");
    } catch (err) {
      console.error("Error deleting DTR:", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://sql12.freesqldatabase.com:3306/api/dtr/${selectedDTR.id}`,
        selectedDTR
      );
      setDtrs((prev) =>
        prev.map((dtr) => (dtr.id === selectedDTR.id ? selectedDTR : dtr))
      );
      setEditMode(false);
      alert("DTR updated.");
    } catch (err) {
      console.error("Error updating DTR:", err);
    }
  };

  const handleAdd = async () => {
    const id = prompt("Enter employee ID:");
    if (!id) return;
    const employeeName = prompt("Enter employee name:");
    if (!employeeName) return;
    const email = prompt("Enter employee company email:");
    if (!email) return;

    try {
      await axios.post("http://sql12.freesqldatabase.com:3306/api/dtr", {
        id,
        employee_name: employeeName,
        company_email: email,
      });
      fetchDTRs();
      alert("New DTR entry added.");
    } catch (err) {
      console.error("Error adding DTR:", err);
      alert("Failed to add DTR. Check console for details.");
    }
  };

  const filteredDTRs = dtrs.filter((dtr) =>
    dtr.employee_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getMonthName = () => {
    if (selectedDTR?.date) {
      const date = new Date(selectedDTR.date);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    }
    const now = new Date();
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="employee-page">
      <div
        className="search-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search DTR by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>
          + Add DTR
        </button>
      </div>

      <div className="employee-table">
        <div
          className="table-header"
          style={{ gridTemplateColumns: "0.5fr 2fr 0.5fr" }}
        >
          <span>ID</span>
          <span>Employee</span>
        </div>
        {filteredDTRs.map((dtr) => (
          <div
            key={dtr.id}
            className="table-row"
            style={{ gridTemplateColumns: "0.5fr 2fr 0.5fr" }}
          >
            <span>{dtr.id}</span>
            <span
              className="clickable-name"
              onClick={() => fetchDTRDetails(dtr.id)}
            >
              {dtr.employee_name}
            </span>
            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <FaEdit
                className="edit-icon"
                onClick={() => fetchDTRDetails(dtr.id, true)}
                title="Edit"
              />
              <FaTrash
                className="delete-icon"
                onClick={() => handleDelete(dtr.id)}
                title="Delete"
              />
            </span>
          </div>
        ))}
      </div>

      {modalVisible && selectedDTR && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: "400px" }}
          >
            {!editMode ? (
              <>
                <h2>{selectedDTR.employee_name}</h2>
                <p>{selectedDTR.company_email}</p>

                <h3 style={{ marginTop: "20px" }}>{getMonthName()}</h3>

                <div className="cutoff-card-container">
                  <div className="cutoff-card">
                    <h4>1–15 Cut-off</h4>
                    <p>Details for 1–15 go here...</p>
                  </div>
                  <div className="cutoff-card">
                    <h4>16–31 Cut-off</h4>
                    <p>Details for 16–31 go here...</p>
                  </div>
                  <div className="cutoff-card add-card">
                    <FaPlus size={20} />
                    <p>Add Extra</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={selectedDTR.employee_name}
                  onChange={(e) =>
                    setSelectedDTR({
                      ...selectedDTR,
                      employee_name: e.target.value,
                    })
                  }
                />
                <input
                  type="email"
                  placeholder="Company Email"
                  value={selectedDTR.company_email}
                  onChange={(e) =>
                    setSelectedDTR({
                      ...selectedDTR,
                      company_email: e.target.value,
                    })
                  }
                />
              </>
            )}

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
