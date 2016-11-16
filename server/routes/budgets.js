'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Budget = mongoose.model('Budget');

var budgets = [
  {
    "id": 1,
    "start_period": "2016-09-24T07:00:00.000Z",
    "existing_cash": 22525,
    "current_income": 1800,
    "budget_items": [
      {
        "editing": false,
        "item": "gas",
        "projection": 200,
        "actual": [
          {
            "name": "Done 10/15",
            "amount": 35
          }
        ]
      },
      {
        "editing": false,
        "item": "food",
        "projection": 250,
        "actual": [
          {
            "name": "Hello",
            "amount": 180
          }
        ]
      },
      {
        "editing": false,
        "item": "other",
        "projection": 250,
        "actual": [
          {
            "name": "Blah blah",
            "amount": 75
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "start_period": "2016-10-05T07:00:00.000Z",
    "existing_cash": 25525,
    "current_income": 1650,
    "budget_items": [
      {
        "editing": false,
        "item": "gas",
        "projection": 140,
        "actual": [
          {
            "name": "Done 10/15",
            "amount": 55
          }
        ]
      },
      {
        "editing": false,
        "item": "food",
        "projection": 190,
        "actual": [
          {
            "name": "Hello",
            "amount": 165
          },
          {
            "name": "Trader Joe's",
            "amount": 125
          }
        ]
      },
      {
        "editing": false,
        "item": "other",
        "projection": 50,
        "actual": [
          {
            "name": "Blah blah",
            "amount": 92
          }
        ]
      }
    ]
  }
];

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

// // GET all MOCK budgets entries
// router.get('/budgets', function(req, res, next) {
//   res.status(200).json(budgets);
// });

// GET all budgets entries
router.get('/budgets', function(req, res, next) {
  Budget.find(function(err, budgets){
    if(err) { return next(err); }

    if (budgets.length === 0) {
      var error = new Error('No budgets yet');
      error.status = 200;
      return next(error);
    }

    // send projects
    res.json(budgets);
  });
});

// POST create budget entry
router.post('/budgets', function (req, res, next) {
  var budget = new Budget(req.body);

  budget.save(function(err, budget) {
    if (err) return next(err);

    //send the budget
    res.status(201).json(budget);
  });
});

// PUT update a budget entry
router.put('/budgets/:id', function (req, res, next) {
  // runValidators makes it so the updated values are validated again before saving
  req.budget.update(req.body, { runValidators: true }, function (err, budget) {
    if (err) return next(err);

    // send budget
    res.status(200).json(budget);
  });
});

// DELETE delete a budget entry
router.delete('/budgets/:id', function (req, res, next) {
  req.budget.remove(function(err, response) {
    if (err) return next(err);

    res.status(201).json(response);
  });
});

module.exports = router;
