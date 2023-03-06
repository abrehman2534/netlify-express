const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Email = require('../utils/email');
// const fs = require('fs');
// exports.checkBody = (req, res, next) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).json({
//       status: 'success',
//       message: 'Missing name or email or password or billing_address',
//     });
//   }
//   next();
// };

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'There is no user with this email' });
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const message = `Forgot your Passsword ? Submit a patch request with your new Password and passwordConfirm to:${resetURL}.\nIf you did n't forgot your password please ignore this email`;
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    // });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (e) {
    console.log(e, 'Error');
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({
      status: 'fail',
      message: `There was error sending email${e} `,
    });
  }
};

exports.resetPasssword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: 'Token invalid',
    });
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err ',
    data: null,
    message: 'This route is not yet defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    data: null,
    message: 'This route is not defined',
  });
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      billing_address: req.body.billing_address,
    });
    const token = signToken(newUser._id);
    console.log(token, 'Token>>>');
    newUser.password = undefined;
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    data: null,
    message: 'This routeis not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    data: null,
    message: 'This routeis not defined',
  });
};
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Please provide email and passsword!');
    }
    const user = await User.findOne({ email: email }).select('+password');
    const correct = console.log(user, 'User');
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      message: 'Login Successfully',
      token,
      data: {
        user: {
          id: user?._id,
          email: user?.email,
          name: user?.name,
        },
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Login failed',
    });
  }
};
