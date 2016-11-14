'use strict';

var express = require('express');
var router = express.Router();

// GET all budgets entries
router.get('/users', function(req, res, next) {
  res.send('Respond with a resource');
});

module.exports = router;
