const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (User.db.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name: name || 'User',
        email,
        password: hashedPassword,
        role: role || 'jobseeker'
      });
      await user.save();

      const secret = process.env.JWT_SECRET || 'devops-secret-key-hirehub-2026';
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: '24h' });

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    // Database fallback response if MongoDB is offline
    const secret = process.env.JWT_SECRET || 'devops-secret-key-hirehub-2026';
    const token = jwt.sign({ email, role: role || 'jobseeker' }, secret, { expiresIn: '24h' });
    res.status(201).json({
      message: 'User registered (mock mode)',
      token,
      user: { name: name || 'User', email, role: role || 'jobseeker' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (User.db.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const secret = process.env.JWT_SECRET || 'devops-secret-key-hirehub-2026';
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: '24h' });

      return res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    // Database fallback response if MongoDB is offline
    const secret = process.env.JWT_SECRET || 'devops-secret-key-hirehub-2026';
    const token = jwt.sign({ email, role: 'jobseeker' }, secret, { expiresIn: '24h' });
    res.json({
      message: 'Login successful (mock mode)',
      token,
      user: { email, role: 'jobseeker' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
router.get('/me', auth, async (req, res) => {
  try {
    if (User.db.readyState === 1) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }
    res.json({ email: req.user.email, role: req.user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
