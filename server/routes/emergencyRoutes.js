const express = require('express');
const router = express.Router();
const EmergencyAlert = require('../models/EmergencyAlert');
const jwt = require('jsonwebtoken');

// Middleware to check auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// 🔴 POST - Trigger emergency
router.post('/', authMiddleware, async (req, res) => {
  try {
    const alert = new EmergencyAlert({ userId: req.userId });
    await alert.save();
    res.status(201).json({ message: '🚨 Emergency alert triggered!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger alert' });
  }
});

// 🟢 GET - All active alerts (for doctor/family)
router.get('/', authMiddleware, async (req, res) => {
  if (req.role !== 'doctor' && req.role !== 'family') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const alerts = await EmergencyAlert.find({ status: 'active' }).populate('userId', 'name email role');
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

module.exports = router;
