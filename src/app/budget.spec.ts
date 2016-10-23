/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Budget } from './budget';

describe('Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ]
    });
  });

  it('should create an instance', () => {
    expect(new Budget()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    let budget = new Budget({
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
        }
      ]
    });

    expect(budget.id).toEqual(1);
    expect(budget.start_period).toEqual('9/24/2016');
    expect(budget.existing_cash).toEqual(22525);
    expect(budget.current_income).toEqual(1800);
    expect(budget.budget_items[0].editing).toEqual(false);
    expect(budget.budget_items[0].item).toEqual('gas');
    expect(budget.budget_items[0].projection).toEqual(200);
    expect(budget.budget_items[0].actual[0].name).toEqual('Done 10/15');
    expect(budget.budget_items[0].actual[0].amount).toEqual(35);
  });
});
