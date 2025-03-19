const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  // POST /register
  static async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }
    try {
      // Check if user exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
      // Hash password and create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = await User.create(username, hashedPassword);
      return res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      console.error('Error in register:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // POST /login
  static async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Compare password with hashed value
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Generate a JWT token (expires in 1 hour)
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /users (protected)
  static async getUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (error) {
      console.error('Error in getUsers:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = UserController;
