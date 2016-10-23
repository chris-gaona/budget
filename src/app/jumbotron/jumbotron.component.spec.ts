/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { JumbotronComponent } from './jumbotron.component';

describe('Component: Jumbotron', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JumbotronComponent
      ],
    });
  });

  it('should create an instance', () => {
    let fixture = TestBed.createComponent(JumbotronComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Budget Tracker'`, async(() => {
    let fixture = TestBed.createComponent(JumbotronComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Budget Tracker');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(JumbotronComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Budget Tracker');
  }));
});
