'use strict';
// database configuration
let config = {};
let MODULUS_USERNAME = process.env.MODULUS_USERNAME;
let MODULUS_PASSWORD = process.env.MODULUS_PASSWORD;
let prodDB;
if (MODULUS_USERNAME !== undefined && MODULUS_PASSWORD !== undefined) {
    prodDB = 'mongodb://' + MODULUS_USERNAME + ':' + MODULUS_PASSWORD + '@olympia.modulusmongo.net:27017/iW3otapu';
}
else {
    let configFile = require('./../config.json');
    prodDB = configFile.production;
}
config.mongoURI = {
    development: 'mongodb://localhost/budget',
    test: 'mongodb://localhost/budget-test',
    production: prodDB
};
module.exports = config;
//# sourceMappingURL=database.js.map