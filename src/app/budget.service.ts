import { Injectable } from '@angular/core';
import { Budget } from './budget';

@Injectable()
export class BudgetService {
  // placeholder for budgets
  budgets: Budget[] = [{
    id: 1,
    start_period: '9/24/2016',
    existing_cash: 22525,
    current_income: 1800,
    budget_items: [
      {
        editing: false,
        item: 'gas',
        projection: 200,
        actual: [
          {
            name: 'Done 10/15',
            amount: 35
          }
        ]
      },
      {
        editing: false,
        item: 'food',
        projection: 250,
        actual: [
          {
            name: 'Trader Joe\'s',
            amount: 125
          }
        ]
      },
      {
        editing: false,
        item: 'other',
        projection: 250,
        actual: [
          {
            name: 'Blah blah',
            amount: 75
          }
        ]
      }
    ]
  },
  {
    id: 2,
    start_period: '10/5/2016',
    existing_cash: 25525,
    current_income: 1650,
    budget_items: [
      {
        editing: false,
        item: 'gas',
        projection: 200,
        actual: [
          {
            name: 'Done 10/15',
            amount: 35
          }
        ]
      },
      {
        editing: false,
        item: 'food',
        projection: 250,
        actual: [
          {
            name: 'Trader Joe\'s',
            amount: 125
          }
        ]
      },
      {
        editing: false,
        item: 'other',
        projection: 250,
        actual: [
          {
            name: 'Blah blah',
            amount: 75
          }
        ]
      }
    ]
  }];

  constructor() {
  }

  // get all budgets
  getAllBudgets(): Budget[] {
    return this.budgets;
  }

  // get a single budget
  getBudgetById() {

  }

  // add new budget
  addBudget() {

  }

  // update existing budget
  updateBudgetById() {

  }

  // delete an existing budget
  deleteTodoById() {

  }
}
