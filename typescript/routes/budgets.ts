'use strict';

import express = require('express');
const router = express.Router();

import mongoose = require('mongoose');
import IBudget = require('../models/Budgets');
let Budget = mongoose.model('Budget');
let User = mongoose.model('User');

import jwt = require('express-jwt');
let jwtSecret;

// let typescript/compiler know that budget show be on the request
declare module 'express' {
  interface Request {
    budget: IBudget.IBudget,
    payload: any
  }
}

if (process.env.JWT_SIGNATURE !== undefined) {
  jwtSecret = process.env.JWT_SIGNATURE;
} else {
  jwtSecret = 'SECRET';
}

//middleware for authenticating jwt tokens
let auth = jwt({
  secret: jwtSecret,
  userProperty: 'payload'
});

// creates middleware for all budgets urls to go through first
router.param('id', (req: express.Request, res: express.Response, next: express.NextFunction, id) => {
  // query to find specific budget by ID
  let query = Budget.findById(id);

  // executes the query
  query.exec((err: any, budget: IBudget.IBudget) => {
    // if err pass the error onto the next error handler
    if (err) { return next(err); }

    // if there is no budget return error to error handler saying can't find the budget
    if (!budget) {
      let error: any = new Error('Cannot find the budget');
      error.status = 404;
      return next(error);
    }

    // sets budget to req.project to be passed to next handler
    req.budget = budget;
    return next();
  });
});

router.get('/', auth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  User.findOne({_id: req.payload._id}, '_id userBudgets', (err, user) => {
    if (err) return next(err);

    if (!user) {
      let error: any = new Error('No user found');
      error.status = 404;
      return next(error);
    }

    console.log(user);
    // res.json(user);
    user.populate('userBudgets', (err: any, budgets) => {
      if (err) return next(err);

      res.json(budgets.userBudgets);
    });
  });
});

// POST create budget entry
router.post('/', auth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let budget = new Budget(req.body);

  User.findOne({_id: req.payload._id}, 'userBudgets', (err: any, user) => {
    if (err) return next(err);

    if (!user) {
      var error: any = new Error('No user found');
      error.status = 404;
      return next(error);
    }

    budget.save((error: any, budget) => {
      if (error) return next(error);
      // res.json(user);
      user.userBudgets.push(budget);

      user.save((error2: any, user) => {
        if(error2) return next(error2);

        console.log('Success!');
      });

      //send the budget
      res.status(201).json(budget);
    });
  });
});

// PUT update a budget entry
router.put('/:id', auth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // runValidators makes it so the updated values are validated again before saving
  req.budget.update(req.body, { runValidators: true }, (err: any, budget) => {
    if (err) {
      // check for validation errors
      if (err.name === 'ValidationError') {
        let errorArray = [];

        if (err.errors.current_income) {
          errorArray.push({ code: 400, message: err.errors.current_income.message });
        }

        if (err.errors.existing_cash) {
          errorArray.push({ code: 400, message: err.errors.existing_cash.message });
        }

        let errorMessages = { property: errorArray };

        let error: any = new Error();
        error.status = 400;
        error.message = 'Validation Failed';
        error.errors = errorMessages;
        return next(error);
      } else {
        return next(err);
      }
    } else {
      // send budget
      res.status(200).json(budget);
    }
  });
});

// DELETE delete a budget entry
router.delete('/:id', auth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.budget.remove((err: any, response) => {
    if (err) return next(err);
  });

  //find correct user in order to remove connected to budget
  User.findOne({_id: req.payload._id}, 'userBudgets', (err: any, user) => {
    if (err) return next(err);

    //splice out the deleted post from userPosts array
    user.userBudgets.splice(user.userBudgets.indexOf(req.params.id), 1);

    user.save((err: any, user) => {
      if(err) return next(err);

      console.log('User Budget Deleted');
      res.status(200).json(user);
    });
  });
});

export {router as budget};
