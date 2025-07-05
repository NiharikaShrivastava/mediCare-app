const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

// POST /api/medicine
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newMedicine = new Medicine({
      userId: req.userId,
      ...req.body
    });
    await newMedicine.save();
    res.status(201).json({ message: 'Medicine reminder saved!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving reminder' });
  }
});

// GET /api/medicine
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Medicine.find({ userId: req.userId });
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

module.exports = router;
