const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract', 'Remote'],
    default: 'Full Time'
  },
  salary: {
    type: String,
    default: 'Negotiable'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
