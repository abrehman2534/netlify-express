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
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  street_address: {
    type: String,
    required: [true, 'Street Address is Required'],
  },
  apartments: {
    type: String,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Email is required or Email is already exists'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  zipcode: {
    type: String,
    required: [true, 'Zipcode is required'],
  },
  phone: {
    type: String,
    maxLength: 100,
    required: [true, 'Phone number is required field'],
  },
  card_holder_name: {
    type: String,
    required: [true, 'Card holder Name is required'],
  },
  card_token: {
    type: String,
  },
  stripe_customer_id: {
    type: String,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
