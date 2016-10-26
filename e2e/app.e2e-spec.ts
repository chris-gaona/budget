import {browser, element, by, protractor} from "protractor";

describe('Budget App', function() {
  it('should have a title', () => {
    browser.get('/');
    expect(browser.getTitle()).toEqual('TrackBudget');
  });

  it('should display a message for main app title', () => {
    expect(element(by.css('.display-4')).getText()).toEqual('Budget Tracker');
  });

  it('should display a simple sub title', () => {
    expect(element(by.css('.lead')).getText()).toEqual('This is a simple budget tracker using Bootstrap 4 and Angular 2!');
  });

  it('should...');
});
