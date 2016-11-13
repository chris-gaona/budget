/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbotronComponent } from './jumbotron.component';
import { AbstractMockObservableService } from '../mock-budget.service';
import { AuthService } from '../auth.service';

class MockService extends AbstractMockObservableService {
  // getBudgets() {
  //   return this;
  // }
}

describe('Component: Jumbotron', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JumbotronComponent
      ],
    }).overrideComponent(JumbotronComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockService }
        ]
      }
    });

    // create component and test fixture
    fixture = TestBed.createComponent(JumbotronComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Budget Tracker'`, async(() => {
    expect(component.title).toEqual('Budget Tracker');
  }));

  // it('should render title in a h1 tag', async(() => {
  //   fixture.detectChanges();
  //   let compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Budget Tracker');
  // }));
});
