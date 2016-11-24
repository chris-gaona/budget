'use strict';

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

//mongoose connection
var mongoose = require('mongoose');
require('./models/Budgets');
require('./models/Users');
var config = require('./config/database');

require('./config/passport');

var routes = require('./routes/budgets');
var userRoutes = require('./routes/auth');
var getUser = require('./routes/users');

var app = express();

mongoose.connect(config.mongoURI[app.settings.env], function(err) {
  if (err) {
    console.log('Failed connecting to Mongodb!');
  } else {
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

// allow cors only for local dev
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.set('env', 'production');

if (app.get('env') === 'production') {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, '/../dist')));
}

app.use('/api/budgets', routes);
app.use('/', userRoutes);
app.use('/user', getUser);

app.get('/favicon.ico', function(req, res) {
  res.send(200);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
