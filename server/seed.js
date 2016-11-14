'use strict';

var seeder = require('mongoose-seeder');
var data = require('./seed.json');

// seed the mongoose / mongodb database
seeder.seed(data, {dropCollections: true}).then(function (dbData) {
  // The database objects are stored in dbData
  console.log(dbData);
// catch any errors
}).catch(function (err) {
  // handle error
  if (err) {
    console.log(err);
  }
});
