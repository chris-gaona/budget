/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { HeaderComponent } from './header/header.component';
import { OverviewComponent } from './overview/overview.component';
import { ResultsComponent } from './results/results.component';
import { FormsModule } from '@angular/forms';
import { BudgetService } from './budget.service';
import { ModalComponent } from './modal/modal.component';
import { AbstractMockObservableService } from './mock-budget.service';
import { UserService } from './user.service';

class MockService extends AbstractMockObservableService {
  getAllBudgets() {
    return this;
  }

  getUser() {
    return this;
  }

  updateBudgetById() {
    return this;
  }
}

describe('App: Budget', () => {
  let component;
  let fixture;
  let budgetService;
  let userService;

  beforeEach(() => {
    budgetService = new MockService();
    userService = new MockService();

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        AppComponent,
        JumbotronComponent,
        HeaderComponent,
        OverviewComponent,
        ResultsComponent,
        ModalComponent
      ]
    }).overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: BudgetService, useValue: budgetService },
          { provide: UserService, useValue: userService }
        ]
      }
    });

    // create component and test fixture
    fixture = TestBed.createComponent(AppComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('#loggedInUser()', () =>{
    it('should get the currently logged in user', async(() => {
      let user = {username: 'jake123', firstName: 'Jake'};
      userService.content = user;
      component.loggedInUser();
      expect(component.currentUser).toBe(user);
    }));
  });

  describe('#getAllBudgets()', () => {
    it('should get all budgets but return no budgets', async(() => {
      budgetService.content = [];
      component.visibleBudgets = true;
      component.getAllBudgets();
      expect(component.visibleBudgets).toBe(false);
    }));

    it('should get all budgets & return budgets', async(() => {
      let allBudgets = [{budget1: 'budget1'}, {budget2: 'budget2'}, {budget3: 'budget3'}];
      budgetService.content = allBudgets;
      component.visibleBudgets = false;
      component.getAllBudgets();
      expect(component.budgets).toBe(allBudgets);
      expect(component.visibleBudgets).toBe(true);
      expect(component.selectedBudget).toBe(allBudgets[2]);
    }));
  });

  describe('Manipulating the data', () => {
    let budget = {
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
        }
      ]
    };

    describe('#chosenBudget(budget)', () => {
      it('should change the selected budget', async(() => {
        component.chosenBudget(budget);
        expect(component.selectedBudget).toEqual(budget);
      }));
    });

    describe('#changeVisibleBudget(boolean)', () => {
      it('should store to boolean value in visibleBudgets variable', async(() => {
        component.changeVisibleBudget(true);
        expect(component.visibleBudgets).toBe(true);
      }));
    });

    describe('#saveAll()', () => {
      it('should save all the items in the current budget', async(() => {
        let selectedBudget = {
          "_id": 1,
          "start_period": "2016-09-24T07:00:00.000Z",
          "existing_cash": 22525,
          "current_income": 1800,
          "budget_items": [
            {
              "editing": true,
              "item": "gas",
              "projection": 200,
              "actual": [
                {
                  "name": "Done 10/15",
                  "amount": 35
                }
              ]
            }
          ]
        };

        budgetService.content = 'some content';
        component.addingBudgetItem = true;
        component.selectedBudget = selectedBudget;
        component.saveAll();
        expect(component.addingBudgetItem).toBe(false);
        expect(component.selectedBudget.budget_items[0].editing).toBe(false);
      }));
    });

    describe('#addBudgetItem()', () => {
      it('should save all items including budget items and actual items', async(() => {
        component.selectedBudget = budget;
        expect(component.selectedBudget.budget_items.length).toEqual(2);
        component.addBudgetItem();
        expect(component.selectedBudget.budget_items.length).toEqual(3);
        expect(component.selectedBudget.budget_items[2].editing).toEqual(true);
        expect(component.selectedBudget.budget_items[2].item).toEqual('');
        expect(component.selectedBudget.budget_items[2].projection).toEqual(0);
      }));
    });

    describe('#deleteBudgetItem(budgetItem)', () => {
      it('should delete a specific budget item within a budget', async(() => {
        component.selectedBudget = budget;
        expect(component.selectedBudget.budget_items.length).toEqual(3);
        component.deleteBudgetItem(budget.budget_items[0]);
        expect(component.selectedBudget.budget_items.length).toEqual(2);
        expect(component.selectedBudget.budget_items[0].item).toEqual('food');
        expect(component.selectedBudget.budget_items[0].projection).toEqual(250);
      }));
    });

    describe('#addActualItem(actual)', () => {
      it('should add a new actual item', async(() => {
        expect(budget.budget_items[0].actual.length).toEqual(1);
        component.addActualItem(budget.budget_items[0].actual);
        expect(budget.budget_items[0].actual.length).toEqual(2);
        expect(budget.budget_items[0].actual[1].name).toEqual('');
        expect(budget.budget_items[0].actual[1].amount).toEqual(0);
      }));
    });

    describe('#deleteActual(budget, actual)', () => {
      it('should delete specific actual item within a budget item', async(() => {
        expect(budget.budget_items[0].actual.length).toEqual(2);
        component.deleteActual(budget.budget_items[0], budget.budget_items[0].actual[1]);
        expect(budget.budget_items[0].actual.length).toEqual(1);
      }));
    });

    describe('Using the data', () => {
      let budgetItem = {
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
                amount: 35,
                expense: true
              },
              {
                name: 'Done',
                amount: 15,
                expense: false
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
                amount: 125,
                expense: false
              }
            ]
          }
        ]
      };

      describe('#getActualTotal(budget)', () => {
        it('should calculate the sub total for each budget item', async(() => {
          component.totalActual = 0;
          expect(component.totalActual).toEqual(0);
          component.getActualTotal(budgetItem.budget_items[0]);
          expect(component.totalActual).toEqual(20);
        }));
      });

      describe('#getTotalSpent()', () => {
        it('should calculate total spent for actual', async(() => {
          component.totalSpent = 0;
          component.totals = [];
          component.mergeTotals = 0;
          component.selectedBudget = budget;
          component.getTotalSpent(budget.budget_items, 'actual');
          expect(component.totals).toEqual([-125]);
          expect(component.mergeTotals).toEqual(-125);
          expect(component.actualObject).toEqual({
            totalSpent: -125,
            totalSaving: 1925,
            percSaving: 1.0694444444444444,
            endingCash: 24450
          });
        }));

        it('should calculate total spent for projection', async(() => {
          component.totalSpent = 0;
          component.totals = [];
          component.mergeTotals = 0;
          component.selectedBudget = budget;
          component.getTotalSpent(budget.budget_items, 'projection');
          expect(component.totalSpent).toEqual(250);
          expect(component.projectionObject).toEqual({
            totalSpent: 250,
            totalSaving: 1550,
            percSaving: 0.8611111111111112,
            endingCash: 24075
          });
        }));
      });
    });
  });
});
