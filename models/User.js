const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  publisherName:{
    type:String, 
    require: true,
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
