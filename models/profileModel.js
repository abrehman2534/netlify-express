const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First Name is required'],
  },
  last_name: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  company_name: {
    type: String,
    required:[true,'Company Name is required'],
  },
  country:{
    type:String,
    required:[true,'Country is required']
  },
  street_address:{
    type:String,
    required:[true, 'Street Address is Required']
  },
  apartments:{
    type:String
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Email is required or Email is already exists'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
  },
  billing_address: {
    type: String,
    trim: true,
    required: [true, 'Billing Address is required'],
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
