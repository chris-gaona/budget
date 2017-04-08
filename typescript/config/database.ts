
'use strict';

// database configuration

let config: any = {};
let MONGODB_URI = process.env.MONGODB_URI;
let prodDB;

if (MONGODB_URI !== undefined) {
  prodDB = MONGODB_URI;
} else {
  let configFile = require('./../config.json');
  prodDB = configFile.production;
}

config.mongoURI = {
  development: 'mongodb://localhost/budget',
  test: 'mongodb://localhost/budget-test',
  production: prodDB
};

export = config;
