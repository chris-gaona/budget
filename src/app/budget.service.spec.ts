/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BudgetService } from './budget.service';
import { Http } from '@angular/http';
import { Budget } from './budget';

describe('Service: Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetService]
    });
  });

  it('should ...', inject([BudgetService], (service: BudgetService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getAllBudgets', () => {
    it('should return an array with 2 objects of data by default', inject([BudgetService], (service: BudgetService) => {
      expect(service.getAllBudgets()).toBeDefined();
      expect(service.getAllBudgets().length).toEqual(2);
    }));

    it('should return all budgets', inject([BudgetService], (service: BudgetService) => {
      let budget1 = new Budget({
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
          }
        ]
      });

      service.addBudget(budget1);
      expect(service.getAllBudgets().length).toEqual(3);
      expect(service.getAllBudgets()[2]).toEqual(budget1);
      expect(service.getAllBudgets()[2].id).toEqual(3);
    }));
  });

  describe('#addBudget', () => {
    it('should automatically assign an incrementing id', inject([BudgetService], (service: BudgetService) => {
      let budget1 = new Budget({
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
          }
        ]
      });

      service.addBudget(budget1);
      expect(service.getBudgetById(3)).toEqual(budget1);
    }));
  });
});
