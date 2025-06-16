const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login_app'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1); // Exit if DB connection fails
  }
  console.log('MySQL connected...');
});

// ==================== ROUTES ====================

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login DB error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Get all employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT ID, Name, Role FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json(results);
  });
});

// Get employee by ID
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM employees WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json(results[0]);
  });
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ success: false, message: 'Name and role are required.' });
  }

  const query = 'INSERT INTO employees (name, role) VALUES (?, ?)';

  db.query(query, [name, role], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    res.status(201).json({ success: true, id: result.insertId });
  });
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const query = 'UPDATE employees SET ? WHERE id = ?';

  db.query(query, [updatedData, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee updated successfully' });
  });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM employees WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  });
});

// ==================== DTR ROUTES ====================



// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
