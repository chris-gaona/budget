'use strict';

// defines needed variables
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var jwt = require('express-jwt');
var jwtSecret;

if (process.env.JWT_SIGNATURE !== undefined) {
  jwtSecret = process.env.JWT_SIGNATURE;
} else {
  jwtSecret = 'SECRET';
}

//middleware for authenticating jwt tokens
var auth = jwt({
  secret: jwtSecret,
  userProperty: 'payload'
});

// get a specific user
router.get('/:username', function(req, res, next) {
  // username taken from the url
  var user = req.params.username;

  // find the specific user in the database
  User.findOne({username: user}, '_id username firstName', function(err, user) {
    if (err) return next(err);
    if (!user) {
      var error = new Error('No user found');
      error.status = 404;
      return next(error);
    }
    res.json(user);
  });

});

module.exports = router;
