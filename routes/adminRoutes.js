const express = require('express');
const router = express.Router();
const db = require('../database');

// Login an admin user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE email = ? AND isAdmin = 1', [email], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(401).json({ error: 'No admin account found with this email' });
    }

    if (admin.password === password) {
      const { password, ...adminInfo } = admin;
      res.json({ message: 'Admin login successful', user: adminInfo });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  });
});

// Get all users (Admin only)
router.get('/users', (req, res) => {
  // In a real app, verify admin token here
  db.all('SELECT id, name, email, studentId, age, gender, address, isAdmin, isPremium FROM Users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;
