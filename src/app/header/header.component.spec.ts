/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderComponent } from './header.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { BudgetService } from '../budget.service';
import { AbstractMockObservableService } from '../mock-budget.service';
import { ToastModule } from 'ng2-toastr';

class MockService extends AbstractMockObservableService {
  updateBudgetById() {
    return this;
  }

  deleteBudgetById() {
    return this;
  }

  addBudget() {
    return this;
  }
}

describe('HeaderComponent', () => {
  let component;
  let fixture;
  let budgetService;

  beforeEach(() => {
    budgetService = new MockService();

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ToastModule
      ],
      declarations: [
        HeaderComponent,
        ModalComponent
      ]
    }).overrideComponent(HeaderComponent, {
      set: {
        providers: [
          { provide: BudgetService, useValue: budgetService }
        ]
      }
    });

    // create component and test fixture
    fixture = TestBed.createComponent(HeaderComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('#createEmptyBudget()', () => {
    it('should create a new empty budget', () => {
      let budgets = [{
        _id: 1,
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
                amount: 35,
                expense: true
              }
            ]
          }
        ]
      }];

      component.budgets = budgets;
      budgetService.content = budgets[0];
      component.createEmptyBudget();
      expect(component.shownBudget).toBeDefined();
      expect(component.budgets).toBeDefined();
      expect(component.budgets.length).toBeDefined(2);
    });
  });

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
    it('should convert the date from yyyy-mm-dd format to actual new Date() format', async(() => {
      let budget = {
        start_period: '2016-10-29'
      };
      component.editingBudget = true;
      component.reverseDate(budget);
      expect(component.editingBudget).toEqual(false);
      expect(budget.start_period).toEqual(new Date ('Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)'));
    }));
  });

  describe('#createBudget(budget)', () => {
    it('should convert the date to 10/29/2016 format & create the new budget', async(() => {
      let budget = {
        _id: 2,
        start_period: '2016-10-29'
      };

      let budgetArray = [
        {
          _id: 1,
          start_period: '2016-10-29'
        },
        {
          _id: 2,
          start_period: '2016-10-29'
        }
      ];

      budgetService.content = 'some content';
      // component.reuseProjection = true;
      component.budgets = budgetArray;
      component.showDialog = true;
      component.createBudget(budget);
      expect(component.showDialog).toBe(false);
      expect(budget).toEqual({ _id: 2, start_period: new Date('Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)') });
    }));
  });

  // describe('#updateBudget(budget)', () => {
  //   it('should ....', async(() => {
  //     expect(component).toBeTruthy();
  //   }));
  // });

  describe('#cancelBudget()', () => {
    it('should cancel the newly created budget by deleting the last item in the array', async(() => {
      let budgets = [
        {
          _id: 1,
          start_period: '2016-10-29'
        },
        {
          _id: 2,
          start_period: '2016-10-29'
        },
        {
          _id: 3,
          start_period: '2016-10-29'
        }
      ];

      component.budgets = budgets;
      expect(component.budgets.length).toEqual(3);
      budgetService.content = 'some content';
      component.cancelBudget();
      expect(component.budgets.length).toEqual(2);
      expect(component.budgets).toEqual([{
          _id: 1,
          start_period: '2016-10-29'
        },
        {
          _id: 2,
          start_period: '2016-10-29'
        }]);
    }));
  });

  describe('#deleteBudget(budget)', () => {
    it('should delete a specific budget', () => {
      let budgets = [
        {
          _id: 1,
          start_period: '2016-10-29'
        },
        {
          _id: 2,
          start_period: '2016-10-29'
        },
        {
          _id: 3,
          start_period: '2016-10-29'
        }
      ];

      component.budgets = budgets;
      expect(component.budgets.length).toEqual(3);
      budgetService.content = budgets[0];
      component.deleteBudget(budgets[0]);
      expect(component.budgets.length).toEqual(2);
      expect(component.shownBudget).toEqual(budgets[2]);
    });
  });

  describe('#editBudget(budget)', () => {
    it('should make the existing budget ready to be edited in the modal', async(() => {
      let budget = ['apples'];
      let realBudget = {
        start_period: new Date('10/29/2016')
      };
      component.shownBudget = budget;
      component.editBudget(realBudget);
      expect(component.shownBudget).toEqual({ start_period: '2016-10-29' });
    }));
  });

  describe('#addUpdate(budget)', () => {
    it('should add an update to an existing budget', () => {
      let budgets = [
        {
          _id: 1,
          start_period: '2016-10-29'
        },
        {
          _id: 2,
          start_period: '2016-10-29'
        },
        {
          _id: 3,
          start_period: '2016-10-29'
        }
      ];

      let budget = {
        _id: 1,
        start_period: '2016-09-24'
      };

      component.budgets = budgets;
      component.editingBudget = true;
      component.showDialog = true;
      budgetService.content = 'some content';
      component.addUpdate(budget);
      expect(budget.start_period).toEqual(new Date('Sat Sep 24 2016 00:00:00 GMT-0700 (PDT)'));
      expect(component.editingBudget).toEqual(false);
      expect(component.editableBudget).toEqual({ _id: 1, start_period: '2016-10-29' });
      expect(component.showDialog).toEqual(false);
    });
  });

  describe('#reuseProjection(budget)', () => {
    it('should copy the projection items from the previous array item', async(() => {
      let budgets = [
        {
          _id: 1,
          start_period: '2016-10-29',
          budget_items: [
            {
              editing: false,
              item: 'gas',
              projection: 200,
              actual: [
                {
                  name: 'Done 10/15',
                  amount: 35,
                  expense: true
                }
              ]
            }
          ]
        },
        {
          _id: 2,
          start_period: '2016-10-29',
          budget_items: [
            {
              editing: false,
              item: 'gas',
              projection: 200,
              actual: [
                {
                  name: 'Done 10/15',
                  amount: 35,
                  expense: true
                }
              ]
            }
          ]
        }
      ];

      let budget = {
        _id: 1,
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
                amount: 35,
                expense: true
              }
            ]
          }
        ]
      };

      component.budgets = budgets;
      component.showDialog = true;
      budgetService.content = 'some content';
      component.reuseProjections(budget);
      expect(component.editableBudget).toEqual(budgets[0]);
      expect(component.showDialog).toEqual(false);
    }));
  });

  describe('#obtainPreviousBudget(string)', () => {
    let budgets = [
      {
        item: 1,
        budget_items: [
          {
            fruit: 'apples',
            actual: [{ amount: 15, expense: true }],
          }
        ]
      },
      {
        item: 2,
        budget_items: [
          {
            fruit: 'grapes',
            actual: [{ amount: 25, expense: true }]
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
