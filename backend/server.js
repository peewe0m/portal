const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Get brief employee list
app.get('/api/employees', (req, res) => {
  const query = 'SELECT id, name, role FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json(results);
  });
});

// Get full employee details by ID
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM employees WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee by ID:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json(results[0]);
  });
});

// ✅ Add a new employee
app.post('/api/employees', (req, res) => {
  const { name, role } = req.body;
  const query = 'INSERT INTO employees (name, role) VALUES (?, ?)';

  db.query(query, [name, role], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.status(201).json({ success: true, id: result.insertId });
  });
});

// ✅ Update an employee by ID
app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const query = 'UPDATE employees SET ? WHERE id = ?';

  db.query(query, [updatedData, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, message: 'Employee updated successfully' });
  });
});

// ✅ Delete an employee by ID
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM employees WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
