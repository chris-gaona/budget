'use strict';

import mongoose = require('mongoose');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

let jwtSecret;

if (process.env.JWT_SIGNATURE !== undefined) {
  jwtSecret = process.env.JWT_SIGNATURE;
} else {
  jwtSecret = 'SECRET';
}

export interface IUser extends mongoose.Document {
  _id: string;
  username: string;
  firstName: string;
  hash: string;
  salt: string;
  userBudgets: any;
  setPassword: any;
  save: any;
  generateJWT: any;
  validPassword: any;
}

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, 'Username is required'],
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  hash: {
    type: String,
    required: [true, 'Password is required']
  },
  salt: {
    type: String,
    required: true
  },
  userBudgets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
  }]
});

// add custom validation to username to make sure the username is not already taken
UserSchema.path('username').validate(function (value, done) {
  this.model('User').count({ username: value }, function (err, count) {
    if (err) {
      return done(err);
    }
    // If `count` is greater than zero, "invalidate"
    done(!count);
  });
}, 'The username you provided is already in use.');

UserSchema.methods.setPassword = function(password){
  this.salt = bcrypt.genSaltSync(10);

  this.hash = bcrypt.hashSync(password, this.salt);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  let today: any = new Date();
  let exp: any = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt((exp.getTime() / 1000).toString())
  }, jwtSecret);
};

mongoose.model<IUser>('User', UserSchema);
