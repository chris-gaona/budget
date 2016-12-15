'use strict';

// defines needed variables
import express = require('express');
const router = express.Router();

import mongoose = require('mongoose');
let User = mongoose.model('User');

import jwt = require('express-jwt');
let jwtSecret;

if (process.env.JWT_SIGNATURE !== undefined) {
  jwtSecret = process.env.JWT_SIGNATURE;
} else {
  jwtSecret = 'SECRET';
}

//middleware for authenticating jwt tokens
let auth = jwt({
  secret: jwtSecret,
  userProperty: 'payload'
});

// get a specific user
router.get('/:username', auth, function(req, res, next) {
  // username taken from the url
  let user = req.params.username;

  // find the specific user in the database
  User.findOne({username: user}, '_id username firstName', (err: any, user) => {
    if (err) return next(err);
    if (!user) {
      let error: any = new Error('No user found');
      error.status = 404;
      return next(error);
    }
    res.json(user);
  });

});

export {router as users};
