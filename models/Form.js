const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    zipcode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
    campaign:{
      type:String,
      required:true,
    },
    agentName: {
      type: String,
      required: true,
    },
    dob:{
      type:String
    },
    jornaya_leadid:{
      type:String, 
    },
    ip_address:{
      type:String
    },
    Age:{
      type:String, 
    },
    income:{
      type:String, 
    },
    bidId:{
      type:String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Forms', FormSchema);
