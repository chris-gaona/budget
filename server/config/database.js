
'use strict';

// var configFile = require('./config.json');

// database configuration

var config = {};
var MODULUS_USERNAME = process.env.MODULUS_USERNAME;
var MODULUS_PASSWORD = process.env.MODULUS_PASSWORD;
// var prodDB;
//
// if (MODULUS_USERNAME !== undefined && MODULUS_PASSWORD !== undefined) {
//   prodDB = 'mongodb://' + MODULUS_USERNAME + ':' + MODULUS_PASSWORD + '@olympia.modulusmongo.net:27017/iW3otapu';
// } else {
//   prodDB = configFile.production;
// }

config.mongoURI = {
  development: 'mongodb://localhost/budget',
  test: 'mongodb://localhost/budget-test',
  production: 'mongodb://' + MODULUS_USERNAME + ':' + MODULUS_PASSWORD + '@olympia.modulusmongo.net:27017/iW3otapu'
};

module.exports = config;
