const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
    minlength: 8,
    select: false,
  },
  billing_address: {
    type: String,
    trim: true,
    required: [true, 'Billing Address is required'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //Only run this function if password actually modified
  if (!this.isModified('password')) {
    return next();
  } else {
    //Hash the apssword with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //candiataePasssword coming from user not hashed user password is hashed
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
