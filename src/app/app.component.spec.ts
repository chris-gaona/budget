/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { OverviewComponent } from './overview/overview.component';
import { ResultsComponent } from './results/results.component';
import { FormsModule } from '@angular/forms';
import { BudgetService } from './budget.service';

describe('App: Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        AppComponent,
        JumbotronComponent,
        NavbarComponent,
        HeaderComponent,
        OverviewComponent,
        ResultsComponent
      ],
      providers: [ BudgetService ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

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
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        app.chosenBudget(budget);
        expect(app.selectedBudget).toEqual(budget);
      }));
    });

    describe('#addBudgetItem()', () => {
      it('should save all items including budget items and actual items', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.selectedBudget = budget;
        expect(app.selectedBudget.budget_items.length).toEqual(2);
        app.addBudgetItem();
        expect(app.selectedBudget.budget_items.length).toEqual(3);
        expect(app.selectedBudget.budget_items[2].editing).toEqual(true);
        expect(app.selectedBudget.budget_items[2].item).toEqual('');
        expect(app.selectedBudget.budget_items[2].projection).toEqual(0);
      }));
    });

    describe('#cancelAdd()', () => {
      it('should cancel adding a new budget item & delete the last budget item in the array', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.selectedBudget = budget;
        expect(app.selectedBudget.budget_items.length).toEqual(3);
        app.cancelAdd();
        expect(app.selectedBudget.budget_items.length).toEqual(2);
      }));
    });

    describe('#deleteBudgetItem(budgetItem)', () => {
      it('should delete a specific budget item within a budget', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.selectedBudget = budget;
        expect(app.selectedBudget.budget_items.length).toEqual(2);
        app.deleteBudgetItem(budget.budget_items[0]);
        expect(app.selectedBudget.budget_items.length).toEqual(1);
        expect(app.selectedBudget.budget_items[0].item).toEqual('food');
        expect(app.selectedBudget.budget_items[0].projection).toEqual(250);
      }));
    });

    describe('#addActualItem(actual)', () => {
      it('should ....', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        expect(budget.budget_items[0].actual.length).toEqual(1);
        app.addActualItem(budget.budget_items[0].actual);
        expect(budget.budget_items[0].actual.length).toEqual(2);
        expect(budget.budget_items[0].actual[1].name).toEqual('');
        expect(budget.budget_items[0].actual[1].amount).toEqual(0);
      }));
    });

    describe('#deleteActual(budget, actual)', () => {
      it('should delete specific actual item within a budget item', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        expect(budget.budget_items[0].actual.length).toEqual(2);
        app.deleteActual(budget.budget_items[0], budget.budget_items[0].actual[1]);
        expect(budget.budget_items[0].actual.length).toEqual(1);
      }));
    });
  });

  describe('Using the data', () => {
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

    describe('#getActualTotal(budget)', () => {
      it('should calculate the sub total for each budget item', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.totalActual = 0;
        expect(app.totalActual).toEqual(0);
        app.getActualTotal(budget.budget_items[0]);
        expect(app.totalActual).toEqual(35);
      }));
    });

    describe('#getTotalSpent()', () => {
      it('should calculate total spent for actual', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.totalSpent = 0;
        app.totals = [];
        app.mergeTotals = 0;
        app.selectedBudget = budget;
        app.getTotalSpent(budget.budget_items, 'actual');
        expect(app.totals).toEqual([160]);
        expect(app.mergeTotals).toEqual(160);
        expect(app.actualObject).toEqual({
          totalSpent: 160,
          totalSaving: 1640,
          percSaving: 0.9111111111111111,
          endingCash: 24165
        });
      }));

      it('should calculate total spent for projection', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        app.totalSpent = 0;
        app.totals = [];
        app.mergeTotals = 0;
        app.selectedBudget = budget;
        app.getTotalSpent(budget.budget_items, 'projection');
        expect(app.totalSpent).toEqual(450);
        expect(app.actualObject).toEqual({
          totalSpent: 450,
          totalSaving: 1350,
          percSaving: 0.75,
          endingCash: 23875
        });
      }));
    });
  });
});
