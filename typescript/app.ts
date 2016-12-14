'use strict';

import express = require('express');
import path = require('path');
// var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import cors = require('cors');

//mongoose connection
import mongoose = require('mongoose');
require('./models/Budgets');
require('./models/Users');
import config = require('./config/database');

require('./config/passport');

import routes = require('./routes/index');

const app = express();

mongoose.connect(config.mongoURI[app.settings.env], (err) => {
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

app.get('/favicon.ico', (req: express.Request, res: express.Response) => {
  res.send(200);
});

app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  let err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   console.log('error', err);
//   res.status(err.status || 500).json({
//     message: err.message,
//     error: {}
//   });
// });


export = app;
