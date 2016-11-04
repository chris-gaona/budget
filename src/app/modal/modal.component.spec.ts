/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  // let component: ModalComponent;
  // let fixture: ComponentFixture<ModalComponent>;
  let component;
  let fixture;

  // another way to set up testing that I wanted to keep for future reference
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   // let fixture = TestBed.createComponent(ModalComponent);
  //   // let app = fixture.debugElement.componentInstance;
  //   expect(component).toBeTruthy();
  // });

  describe('#close()', () => {
    it('should close the modal and make editing variable false', async(() => {
      component.visible = true;
      component.editing = false;
      component.close();
      expect(component.visible).toEqual(false);
      component.editing = true;
      component.close();
      expect(component.editing).toEqual(false);
    }));
  });

  describe('#reverseDate()', () => {
    it('should reverse the date format from 2016-10-29 to new Date() format', () => {
      let budget = {
        start_period: '2016-10-29'
      };
      component.budget = budget;
      component.reverseDate();
      expect(budget.start_period).toEqual(new Date ('Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)'));
    });
  });

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
});
