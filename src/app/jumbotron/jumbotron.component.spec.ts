/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbotronComponent } from './jumbotron.component';

describe('Component: Jumbotron', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JumbotronComponent
      ],
    });

    // create component and test fixture
    fixture = TestBed.createComponent(JumbotronComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
