const express = require('express');
const router = express.Router();
const db = require('../database');

// Register a new user
router.post('/register', (req, res) => {
  const { name, email, studentId, password, age, gender, address, height, weight } = req.body;

  // Check if user exists
  db.get('SELECT email FROM Users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert new user
    const query = `
      INSERT INTO Users (name, email, studentId, password, age, gender, address, height, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [name, email, studentId, password, age, gender, address, height, weight], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      res.status(201).json({ 
        message: 'Registration successful',
        user: { id: this.lastID, name, email } 
      });
    });
  });
});

// Login an existing user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email address' });
    }

    if (user.password === password) {
      // Don't send the password back to the client
      const { password, ...userWithoutPassword } = user;
      res.json({ message: 'Login successful', user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  });
});

module.exports = router;
