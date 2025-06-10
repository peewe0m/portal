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

// ✅ New endpoint to fetch employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT employeeid, name, role FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
