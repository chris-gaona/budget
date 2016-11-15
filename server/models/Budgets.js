'use strict';

var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({
  user_id: String,
  start_period: {
    type: Date,
    required: [true, 'Start date is required']
  },
  existing_cash: {
    type: Number,
    required: [true, 'Existing cash value required']
  },
  current_income: {
    type: Number,
    required: [true, 'Current income value required']
  },
  budget_items: [
    {
      editing: Boolean,
      item: String,
      projection: Number,
      actual: [
        {
          name: String,
          amount: Number
        }
      ]
    }
  ]
});

mongoose.model('Budget', BudgetSchema);
