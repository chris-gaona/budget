'use strict';

var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({
  user_id: String,
  start_period: {
    type: Date,
    trim: true,
    required: [true, 'Start date is required']
  },
  existing_cash: {
    type: Number,
    trim: true,
    required: [true, 'Existing cash value required']
  },
  current_income: {
    type: Number,
    trim: true,
    required: [true, 'Current income value required']
  },
  budget_items: [
    {
      editing: Boolean,
      item: {
        type: String,
        lowercase: true
      },
      projection: {
        type: Number,
        trim: true
      },
      actual: [
        {
          name: {
            type: String,
            lowercase: true
          },
          amount: {
            type: Number,
            trim: true
          },
          expense: Boolean
        }
      ]
    }
  ]
});

mongoose.model('Budget', BudgetSchema);
