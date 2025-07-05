const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String
  },
  time: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Once'],
    default: 'Daily'
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
