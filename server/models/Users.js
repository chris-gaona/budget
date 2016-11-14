'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: String,
  nickname: String
});

mongoose.model('User', UserSchema);
