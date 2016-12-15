'use strict';
const express = require('express');
const path = require('path');
// var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
//mongoose connection
const mongoose = require('mongoose');
require('./models/Budgets');
require('./models/Users');
const config = require('./config/database');
require('./config/passport');
const routes = require('./routes/index');
const app = express();
mongoose.connect(config.mongoURI[app.settings.env], (err) => {
    if (err) {
        console.log('Failed connecting to Mongodb!');
    }
    else {
        // seed database
        // require('./seed.js');
        // console.log('Successfully connected to Mongodb: ' + config.mongoURI[app.settings.env]);
        console.log('Successfully connected to Mongodb');
    }
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// allow cors only fora local dev
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.set('env', 'production');
if (app.get('env') === 'production') {
    // in production mode run application from dist folder
    app.use(express.static(path.join(__dirname, '../client')));
}
app.use('/api/budgets', routes.budget);
app.use('/', routes.auth);
app.use('/user', routes.users);
app.get('/favicon.ico', (req, res) => {
    res.send(200);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});
module.exports = app;
