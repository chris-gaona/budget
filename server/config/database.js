
'use strict';

var configFile = require('./config.json');

// database configuration

var config = {};
var MODULUS_USERNAME = process.env.MODULUS_USERNAME;
var MODULUS_PASSWORD = process.env.MODULUS_PASSWORD;

config.mongoURI = {
  development: 'mongodb://localhost/budget',
  test: 'mongodb://localhost/budget-test',
  production: configFile.production
};

module.exports = config;
