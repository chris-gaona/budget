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

  describe('#createBudget(budget)', () => {
    it('should convert the date to 10/29/2016 format & create the new budget', async(() => {
      let budget = { start_period: '2016-10-29' };
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

  // describe('#reuseProjection(budget)', () => {
  //   it('should copy the projection items from the previous array item', async(() => {
  //     expect(component).toBeTruthy();
  //   }));
  // });

  describe('#obtainProjection()', () => {
    it('should obtain the projection items from the previous array item', async(() => {
      let budgets = [
        {
          item: 1,
          budget_items: [
            {
              fruit: 'apples',
              actual: ['hola!']
            }
          ]
        },
        {
          item: 2,
          budget_items: [
            {
              fruit: 'grapes',
              actual: ['chow!']
            }
          ]
        }
      ];
      component.budgets = budgets;
      expect(component.obtainProjection()).toEqual([
        {
          fruit: 'apples',
          actual: []
        }
      ]);
    }));
  });
});
