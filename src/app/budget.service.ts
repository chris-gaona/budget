import { Injectable } from '@angular/core';
import { Budget } from './budget';

@Injectable()
export class BudgetService {
  // placeholder for budgets
  budgets: Budget[] = [];

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 2;

  constructor() {
    // adds mock data
    let mockBudget1 = new Budget({
      id: 1,
      start_period: new Date('9/24/2016'),
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
            },
            {
              name: 'Safeway',
              amount: 55
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
    });

    let mockBudget2 = new Budget({
      id: 2,
      start_period: new Date('10/5/2016'),
      existing_cash: 25525,
      current_income: 1650,
      budget_items: [
        {
          editing: false,
          item: 'gas',
          projection: 140,
          actual: [
            {
              name: 'Done 10/15',
              amount: 55
            }
          ]
        },
        {
          editing: false,
          item: 'food',
          projection: 190,
          actual: [
            {
              name: 'Trader Joe\'s',
              amount: 165
            }
          ]
        },
        {
          editing: false,
          item: 'other',
          projection: 50,
          actual: [
            {
              name: 'Blah blah',
              amount: 92
            }
          ]
        }
      ]
    });

    this.addBudget(mockBudget1);
    this.addBudget(mockBudget2);
  }

  // get all budgets
  getAllBudgets(): Budget[] {
    return this.budgets;
  }

  // get a single budget
  getBudgetById(id: number): Budget {
    return this.budgets
      .filter(budget => budget.id === id)
      .pop();
  }

  // add new budget
  addBudget(budget: Budget): BudgetService {
    if (!budget.id) {
      budget.id = ++this.lastId;
    }

    this.budgets.push(budget);
    return this;
  }

  // update existing budget
  updateBudgetById(id: number, values: Object = {}): Budget {
    let budget = this.getBudgetById(id);
    if (!budget) {
      return null;
    }
    // loop through all budget items
    for (let i = 0; i < budget.budget_items.length; i++) {
      // mark each budget item as editing false
      budget.budget_items[i].editing = false;
    }
    // assign the new values to the budget
    Object.assign(budget, values);
    return budget;
  }

  // delete an existing budget
  deleteBudgetById(id: number) {
    // filter() method creates a new array with all elements that pass the test implemented by the provided function
    this.budgets = this.budgets
      .filter(budget => budget.id !== id);
    return this;
  }
}
