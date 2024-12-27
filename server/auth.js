const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ 
        message: 'Name, password, and either email or phone are required' 
      });
    }

    // Check if user already exists
    const checkQuery = email 
      ? 'SELECT * FROM users WHERE email = ?' 
      : 'SELECT * FROM users WHERE phone = ?';
    const checkValue = email || phone;

    db.get(checkQuery, [checkValue], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (user) {
        return res.status(400).json({ 
          message: `User with this ${email ? 'email' : 'phone'} already exists` 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertQuery = `
        INSERT INTO users (name, email, phone, password)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insertQuery, [name, email, phone, hashedPassword], function(err) {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'Error creating user' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: this.lastID },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({
          token,
          user: {
            id: this.lastID,
            name,
            email,
            phone
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, type } = req.body;

    if (!identifier || !password || !type) {
      return res.status(400).json({ 
        message: 'Identifier, password, and type are required' 
      });
    }

    // Find user by email or phone
    const query = type === 'email'
      ? 'SELECT * FROM users WHERE email = ?'
      : 'SELECT * FROM users WHERE phone = ?';

    db.get(query, [identifier], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
