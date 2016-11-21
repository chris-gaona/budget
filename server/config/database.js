
'use strict';

// database configuration

var config = {};
var MODULUS_USERNAME = process.env.MODULUS_USERNAME;
var MODULUS_PASSWORD = process.env.MODULUS_PASSWORD;

config.mongoURI = {
  development: 'mongodb://localhost/budget',
  test: 'mongodb://localhost/budget-test',
  production: 'mongodb://chrisgaona:iamhis4ever@olympia.modulusmongo.net:27017/iW3otapu'
};

module.exports = config;
