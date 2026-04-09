const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Determine the database path
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      studentId TEXT NOT NULL,
      password TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      address TEXT,
      height REAL,
      weight REAL,
      isAdmin BOOLEAN DEFAULT 0,
      isPremium BOOLEAN DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating Users table:', err.message);
    } else {
      console.log('Users table ready.');
      // Insert default admin if not exists
      db.get("SELECT * FROM Users WHERE email = 'admin@campus.edu'", (err, row) => {
        if (!row) {
          db.run(
            `INSERT INTO Users (name, email, studentId, password, isAdmin) VALUES (?, ?, ?, ?, ?)`,
            ['Admin User', 'admin@campus.edu', 'ADMIN001', 'admin123', 1]
          );
        }
      });
    }
  });

  // Additional tables for future use
  db.run(`
    CREATE TABLE IF NOT EXISTS ActivityLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      activityType TEXT,
      duration INTEGER,
      date TEXT,
      FOREIGN KEY(userId) REFERENCES Users(id)
    )
  `);
});

module.exports = db;
