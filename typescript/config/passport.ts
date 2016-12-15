'use strict';

// files to require
import passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
import mongoose = require('mongoose');
import IUser = require('../models/Users');
let User = mongoose.model('User');

// uses passport to check whether the user provides a correct username and password in order to login
passport.use(new LocalStrategy(
  function(username, password, done) {
    // if user is found
    User.findOne({ username: username }, function (err: any, user: IUser.IUser) {
      if (err) return done(err);
      //if no user is found
      if (!user) {
        return done(null, false, { message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Incorrect username or password' } ] } });
      }
      // if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Incorrect username or password' } ] } });
      }
      // else return user
      return done(null, user);
    });
  }
));
