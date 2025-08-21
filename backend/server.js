// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 5000;



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public'))); // 🔥 Serve images from /public

// Load environment variables
require('dotenv').config();

// MySQL Connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // fallback just in case
});


db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ MySQL connected...');
});

// Multer Setup for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ==================== LOGIN ====================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const normalizedEmail = email.trim().toLowerCase();
  const adminQuery = 'SELECT * FROM admin_users WHERE LOWER(company_email) = ? AND password = ?';

  db.query(adminQuery, [normalizedEmail, password], (err, adminResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });

    if (adminResults.length > 0) {
      return res.json({
        success: true,
        role: 'admin',
        user: { id: adminResults[0].admin_id, email: adminResults[0].company_email },
      });
    }

    const userQuery = 'SELECT * FROM users WHERE LOWER(company_email) = ? AND password = ?';
    db.query(userQuery, [normalizedEmail, password], (err, userResults) => {
      if (err) return res.status(500).json({ success: false, message: 'Internal server error' });

      if (userResults.length > 0) {
        return res.json({
          success: true,
          role: 'user',
          user: { id: userResults[0].id, email: userResults[0].company_email },
        });
      }

      res.status(401).json({ success: false, message: 'Invalid email or password' });
    });
  });
});

// ==================== EMPLOYEES ====================
app.get('/api/employees', (req, res) => {
  db.query('SELECT id, name FROM employees', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });

    // Return name + id
    res.json(results.map(emp => ({
      id: emp.id,
      name: emp.name
    })));
  });
});

app.get('/api/employees/:id', (req, res) => {
  db.query('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(results[0]);
  });
});

app.post('/api/employees', (req, res) => {
  const { id, name, role } = req.body;
  if (!id || !name || !role)
    return res.status(400).json({ success: false, message: 'ID, name, and role are required.' });

  db.query(
    'INSERT INTO employees (id, name, role) VALUES (?, ?, ?)',
    [id, name, role],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Error or duplicate ID' });
      res.status(201).json({ success: true, message: 'Employee added successfully' });
    }
  );
});

app.put('/api/employees/:id', (req, res) => {
  db.query('UPDATE employees SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Employee updated' });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  db.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Employee deleted' });
  });
});

// ==================== LEAVE REQUESTS ====================
app.post('/api/leave', upload.single('attachment'), (req, res) => {
  const { email, name, leaveType, reason, from_date, to_date } = req.body;
  const attachment = req.file ? req.file.filename : null;

  if (!email || !name || !leaveType || !reason || !from_date || !to_date) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO leave_requests (company_email, name, leave_type, reason, from_date, to_date, attachment, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(query, [email, name, leaveType, reason, from_date, to_date, attachment], (err) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ success: false, message: 'Insert error' });
    }
    res.status(201).json({ success: true, message: 'Leave request submitted' });
  });
});

app.get('/api/leave', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query('SELECT * FROM leave_requests WHERE company_email = ? ORDER BY id ASC', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.get('/api/leave-requests', (req, res) => {
  db.query('SELECT * FROM leave_requests ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.put('/api/leave-requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Leave request not found' });
    res.json({ success: true, message: 'Status updated' });
  });
});

// ==================== DTR ====================
app.get('/api/dtr', (req, res) => {
  db.query('SELECT id, name AS employee_name, company_email FROM employees', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    res.json(results);
  });
});

app.get('/api/dtr/:id', (req, res) => {
  db.query('SELECT id, name AS employee_name, company_email FROM employees WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(results[0]);
  });
});

app.post('/api/dtr', (req, res) => {
  const { id, employee_name, company_email } = req.body;
  if (!id || !employee_name || !company_email)
    return res.status(400).json({ success: false, message: 'All fields required' });

  db.query(
    'INSERT INTO employees (id, name, company_email, role) VALUES (?, ?, ?, ?)',
    [id, employee_name, company_email, 'N/A'],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Insert error or duplicate ID' });
      res.status(201).json({ success: true, message: 'DTR entry created' });
    }
  );
});

app.put('/api/dtr/:id', (req, res) => {
  const { employee_name } = req.body;
  db.query('UPDATE employees SET name = ? WHERE id = ?', [employee_name, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Update error' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'DTR updated' });
  });
});

app.delete('/api/dtr/:id', (req, res) => {
  db.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Delete error' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'DTR deleted' });
  });
});

// ==================== DASHBOARD STATS ====================
app.get('/api/dashboard-stats', (req, res) => {
  const query = 'SELECT COUNT(*) AS employees FROM employees';
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json({
      employees: result[0].employees,
      absent: 0,
      late: 0,
      present: 0,
      totalUsers: 0,
      workingDays: 0,
    });
  });
});

// ==================== FILE UPLOADS ====================

// Upload Job Description
const jdStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..public/jdfiles');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const jdUpload = multer({ storage: jdStorage });

app.post('/api/employees/upload-jd', jdUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, message: 'Job Description uploaded', filename: req.file.originalname });
});

// Upload Profile Image
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const imageUpload = multer({ storage: imageStorage });

app.post('/api/employees/upload-image', imageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  res.json({ success: true, message: 'Profile image uploaded', filename: req.file.originalname });
});

// ==================== START SERVER ====================
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Server running on:
  → Local:   http://localhost:${PORT}`);
});

