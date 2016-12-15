'use strict';

import mongoose = require('mongoose');

export interface IBudget extends mongoose.Document {
  _id: string;
  user_id: string;
  start_period: string;
  existing_cash: number;
  current_income: number;
  budget_items: any;
}

let BudgetSchema = new mongoose.Schema({
  user_id: String,
  start_period: {
    type: String,
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

mongoose.model<IBudget>('Budget', BudgetSchema);
