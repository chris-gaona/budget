
'use strict';

var configFile = require('./config.json');

// database configuration

var config = {};
var MODULUS_USERNAME = process.env.MODULUS_USERNAME;
var MODULUS_PASSWORD = process.env.MODULUS_PASSWORD;
var prodDB;

if (MODULUS_USERNAME !== undefined && MODULUS_PASSWORD !== undefined) {
  prodDB = 'mongodb://' + MODULUS_USERNAME + ':' + MODULUS_PASSWORD + '@jello.modulusmongo.net:27017/xabeGi8m';
} else {
  prodDB = configFile.production;
}

config.mongoURI = {
  development: 'mongodb://localhost/budget',
  test: 'mongodb://localhost/budget-test',
  production: prodDB
};

module.exports = config;
