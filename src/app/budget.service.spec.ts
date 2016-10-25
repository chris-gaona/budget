/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BudgetService } from './budget.service';
import { Http } from '@angular/http';

describe('Service: Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetService]
    });
  });

  it('should ...', inject([BudgetService], (service: BudgetService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an array with 2 objects of data by default', inject([BudgetService], (service: BudgetService) => {
    let defaultArray = [{
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
    expect(service.getAllBudgets()).toBeDefined();
    expect(service.getAllBudgets()).toEqual(defaultArray);
  }));
});
