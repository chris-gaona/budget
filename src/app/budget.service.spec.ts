/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BudgetService } from './budget.service';
import { Http } from '@angular/http';
import { Budget, BudgetItems, ActualItems } from './budget';

describe('Service: Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ BudgetService ]
    });
  });

  it('should ...', inject([BudgetService], (service: BudgetService) => {
    expect(service).toBeTruthy();
  }));

  const actualItems = new ActualItems(
    {
      name: 'Done 10/15',
      amount: 35
    }
  );

  const budgetItems = new BudgetItems(
    {
      editing: true,
      item: 'gas',
      projection: 200,
      actual: [actualItems]
    }
  );

  const budget1 = new Budget({
    existing_cash: 22525,
    current_income: 1800,
    budget_items: [budgetItems]
  });

  describe('#getAllBudgets', () => {
    it('should return an array with 2 objects of data by default', inject([BudgetService], (service: BudgetService) => {
      expect(service.getAllBudgets()).toBeDefined();
      expect(service.getAllBudgets().length).toEqual(2);
    }));

    it('should return all budgets', inject([BudgetService], (service: BudgetService) => {
      service.addBudget(budget1);
      expect(service.getAllBudgets().length).toEqual(3);
      expect(service.getAllBudgets()[2]).toEqual(budget1);
      expect(service.getAllBudgets()[2].id).toEqual(3);
    }));
  });

  describe('#addBudget', () => {
    it('should automatically assign an incrementing id', inject([BudgetService], (service: BudgetService) => {
      service.addBudget(budget1);
      expect(service.getBudgetById(3)).toEqual(budget1);
    }));
  });

  describe('#deleteBudget', () => {
    it('should remove budget with the corresponding id', inject([BudgetService], (service: BudgetService) => {
      service.addBudget(budget1);
      expect(service.getAllBudgets().length).toEqual(3);
      service.deleteBudgetById(3);
      expect(service.getAllBudgets().length).toEqual(2);
      service.deleteBudgetById(2);
      expect(service.getAllBudgets().length).toEqual(1);
    }));

    it('should not remove anything if budget with corresponding id is not found', inject([BudgetService], (service: BudgetService) => {
      service.addBudget(budget1);
      expect(service.getAllBudgets().length).toEqual(3);
      service.deleteBudgetById(4);
      expect(service.getAllBudgets().length).toEqual(3);
    }));
  });

  describe('#updateBudgetById(id, values)', () => {
    it('should return todo with the corresponding id & updated data', inject([BudgetService], (service: BudgetService) => {
      service.addBudget(budget1);

      let updatedBudget2 = service.updateBudgetById(3, {
        start_period: 'new date',
        existing_cash: 200000
      });

      expect(updatedBudget2.start_period).toEqual('new date');
      expect(updatedBudget2.existing_cash).toEqual(200000);
      expect(updatedBudget2.budget_items.length).toEqual(1);
      expect(updatedBudget2.budget_items[0].item).toEqual('gas');
      expect(updatedBudget2.budget_items[0].editing).toEqual(false);
      expect(updatedBudget2.budget_items[0].actual.length).toEqual(1);
    }));
  });
});
