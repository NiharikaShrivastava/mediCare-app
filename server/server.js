const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes'); // ✅ New import
const emergencyRoutes = require('./routes/emergencyRoutes');


// Load .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // 🔐 Auth routes
app.use('/api/medicine', medicineRoutes); // 💊 Medicine reminder routes
app.use('/api/emergency', emergencyRoutes); // Emergency reminder routes


// Test Route
app.get('/', (req, res) => {
  res.send('🚀 MediCare Backend is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
