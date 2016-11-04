/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderComponent } from './header.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { BudgetService } from '../budget.service';

describe('HeaderComponent', () => {
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        HeaderComponent,
        ModalComponent
      ],
      providers: [
        BudgetService
      ]
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  // describe('#createEmptyBudget()', () => {
  //   it('should ....', async(() => {
  //     expect(component).toBeTruthy();
  //   }));
  // });

  describe('#convertDate()', () => {
    it('should convert the date to yyyy-mm-dd format', async(() => {
      let budget = {
        start_period: 'apples'
      };
      let date = new Date('10/29/2016');
      expect(component.convertDate(budget, date)).toEqual('2016-10-29');
      let newDate = new Date('1/5/2016');
      expect(component.convertDate(budget, newDate)).toEqual('2016-01-05');
    }));
  });

  describe('#reverseDate(budget)', () => {
    it('should convert the date from yyyy-mm-dd format to actual new Date() format', () => {
      let budget = {
        start_period: '2016-10-29'
      };
      component.editingBudget = true;
      component.reverseDate(budget);
      expect(component.editingBudget).toEqual(false);
      expect(budget.start_period).toEqual(new Date ('Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)'));
    });
  });

  describe('#createBudget(budget)', () => {
    it('should convert the date to 10/29/2016 format & create the new budget', async(() => {
      let budget = {
        start_period: '2016-10-29'
      };
      component.showDialog = true;
      component.createBudget(budget);
      expect(component.showDialog).toBe(false);
      expect(budget).toEqual({ start_period: new Date('Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)') });
    }));
  });

  // describe('#updateBudget(budget)', () => {
  //   it('should ....', async(() => {
  //     expect(component).toBeTruthy();
  //   }));
  // });

  describe('#cancelBudget()', () => {
    it('should cancel the newly created budget by deleting the last item in the array', async(() => {
      let budgets = ['Object1', 'Object2', 'Object3'];
      component.budgets = budgets;
      expect(component.budgets.length).toEqual(3);
      component.cancelBudget();
      expect(component.budgets.length).toEqual(2);
      expect(component.budgets).toEqual(['Object1', 'Object2']);
    }));
  });

  describe('#editBudget(budget)', () => {
    it('should make the existing budget ready to be edited in the modal', () => {
      let budget = ['apples'];
      let realBudget = {
        start_period: new Date('10/29/2016')
      };
      component.shownBudget = budget;
      component.editBudget(realBudget);
      expect(component.shownBudget).toEqual({ start_period: '2016-10-29' });
    });
  });

  // describe('#reuseProjection(budget)', () => {
  //   it('should copy the projection items from the previous array item', async(() => {
  //     expect(component).toBeTruthy();
  //   }));
  // });

  describe('#obtainPreviousBudget(string)', () => {
    let budgets = [
      {
        item: 1,
        budget_items: [
          {
            fruit: 'apples',
            actual: [{ amount: 15 }]
          }
        ]
      },
      {
        item: 2,
        budget_items: [
          {
            fruit: 'grapes',
            actual: [{ amount: 25 }]
          }
        ]
      }
    ];

    it('should obtain previous budget', async(() => {
      component.budgets = budgets;
      expect(component.obtainPreviousBudget('pre')).toEqual(
        {
          item: 2,
          budget_items: [
            {
              fruit: 'grapes',
              actual: []
            }
          ],
          total_spent: 25
        });
    }));

    it('should obtain previous, previous budget since new budget array was pushed on', async(() => {
      component.budgets = budgets;
      expect(component.obtainPreviousBudget('post')).toEqual(
        {
          item: 1,
          budget_items: [
            {
              fruit: 'apples',
              actual: []
            }
          ],
          total_spent: 15
        });
    }));
  });
});
