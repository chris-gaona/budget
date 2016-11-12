var express = require('express');
var router = express.Router();

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

// GET all budgets entries
router.get('/budgets', function(req, res, next) {
  res.json(budgets);
});

// // POST create budget entry
// router.post('/budgets', function (req, res, next) {
//   if (req.body) {
//     budgets.push(req.body);
//   }
//
//   res.status(201).json(req.body);
// });
//
// // PUT update a budget entry
// router.put('/budgets/:id', function (req, res, next) {
//   budgets.filter(function (budget) {
//     if (budget.id === req.params.id) {
//       Object.assign(budget, req.body);
//     }
//     res.sendStatus(200);
//   });
//
//   console.log(budgets);
// });

module.exports = router;
