'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Budget = mongoose.model('Budget');
var User = mongoose.model('User');

var jwt = require('express-jwt');
var jwtSecret;

if (process.env.JWT_SIGNATURE !== undefined) {
  jwtSecret = process.env.JWT_SIGNATURE;
} else {
  jwtSecret = 'SECRET';
}

//middleware for authenticating jwt tokens
var auth = jwt({
  secret: jwtSecret,
  userProperty: 'payload'
});

// creates middleware for all budgets urls to go through first
router.param('id', function (req, res, next, id) {
  // query to find specific budget by ID
  var query = Budget.findById(id);

  // executes the query
  query.exec(function (err, budget) {
    // if err pass the error onto the next error handler
    if (err) { return next(err); }

    // if there is no budget return error to error handler saying can't find the budget
    if (!budget) {
      var error = new Error('Cannot find the budget');
      error.status = 404;
      return next(error);
    }

    // sets budget to req.project to be passed to next handler
    req.budget = budget;
    return next();
  });
});

router.get('/', auth, function (req, res, next) {
  User.findOne({_id: req.payload._id}, '_id userBudgets', function(err, user) {
    if (err) return next(err);

    if (!user) {
      var error = new Error('No user found');
      error.status = 404;
      return next(error);
    }

    console.log(user);
    // res.json(user);
    user.populate('userBudgets', function(err, budgets) {
      if (err) {return next(err);}

      res.json(budgets.userBudgets);
    });
  });
});

// POST create budget entry
router.post('/', auth, function (req, res, next) {
  var budget = new Budget(req.body);

  User.findOne({_id: req.payload._id}, 'userBudgets', function(err, user) {
    if (err) return next(err);

    if (!user) {
      var error = new Error('No user found');
      error.status = 404;
      return next(error);
    }

    budget.save(function(error, budget) {
      if (error) return next(error);
      // res.json(user);
      user.userBudgets.push(budget);

      user.save(function(error2, user) {
        if(error2) return next(error2);

        console.log('Success!');
      });

      //send the budget
      res.status(201).json(budget);
    });
  });
});

// PUT update a budget entry
router.put('/:id', auth, function (req, res, next) {
  // runValidators makes it so the updated values are validated again before saving
  req.budget.update(req.body, { runValidators: true }, function (err, budget) {
    if (err) {
      // check for validation errors
      if (err.name === 'ValidationError') {
        var errorArray = [];

        if (err.errors.current_income) {
          errorArray.push({ code: 400, message: err.errors.current_income.message });
        }

        if (err.errors.existing_cash) {
          errorArray.push({ code: 400, message: err.errors.existing_cash.message });
        }

        var errorMessages = { property: errorArray };

        var error = new Error();
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
router.delete('/:id', auth, function (req, res, next) {
  req.budget.remove(function(err, response) {
    if (err) return next(err);
  });

  //find correct user in order to remove connected to budget
  User.findOne({_id: req.payload._id}, 'userBudgets', function(err, user) {
    if (err) return next(err);

    //splice out the deleted post from userPosts array
    user.userBudgets.splice(user.userBudgets.indexOf(req.params.id), 1);

    user.save(function(err, user) {
      if(err) return next(err);

      console.log('User Budget Deleted');
      res.status(200).json(user);
    });
  });
});

module.exports = router;
