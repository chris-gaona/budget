import {browser, element, by, protractor} from "protractor";

describe('Budget App', () => {
  describe('Jumbotron Component Tests', () => {
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

    it('should display a Health Snapshot header', () => {
      expect(element(by.css('.health-snapshot')).getText()).toEqual('Health Snapshot');
    });
  });

  describe('Header Component Tests', () => {
    it('should display option value as the selected budget from data', () => {
      expect(element(by.css('select')).element(by.css('option:checked')).getText()).toEqual('Sep 24, 2016');
      element(by.cssContainingText('option', 'Oct 5, 2016')).click();
      expect(element(by.css('select')).element(by.css('option:checked')).getText()).toEqual('Oct 5, 2016');
      // changing back so tests following this don't break
      element(by.cssContainingText('option', 'Sep 24, 2016')).click();
    });
  });

  describe('Overview Component Tests', () => {
    it('should display overview sections with correct dollar values based on budget selected', () => {
      let overviewItem = element.all(by.css('h3.overview'));
      expect(overviewItem.get(0).getText()).toBe('Total: $22,525.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $1,800.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $290.00');

      element(by.cssContainingText('option', 'Oct 5, 2016')).click();

      expect(overviewItem.get(0).getText()).toBe('Total: $25,525.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $1,650.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $312.00');

      element(by.cssContainingText('option', 'Sep 24, 2016')).click();
    });
  });

  describe('Projection / Actual - Main Section Tests', () => {
    it('should display correct projection items based on budget selected', () => {
      let projectionItems = element.all(by.css('.projection'));
      expect(projectionItems.get(0).getText()).toBe('$200.00\nGas');
      expect(projectionItems.get(1).getText()).toBe('$250.00\nFood');
      expect(projectionItems.get(2).getText()).toBe('$250.00\nOther');
    });

    it('should display correct actual items based on budget selected', () => {
      let actualItems = element.all(by.css('.actual'));
      expect(actualItems.get(0).getText()).toBe('$35.00\nGas');
      expect(actualItems.get(1).getText()).toBe('$180.00\nFood');
      expect(actualItems.get(2).getText()).toBe('$75.00\nOther');
    });

    it('should have input fields in projection & actual hidden as default', () => {
      let projectionItems = element.all(by.css('.projection-inputs'));
      let actualItems = element.all(by.css('.actual-inputs'));
      expect(projectionItems.get(0).isPresent()).toBeFalsy();
      expect(actualItems.get(0).isPresent()).toBeFalsy();
    });

    it('should add a new editable budget/actual item on +Add New button click', () => {
      let projectionInputs = element.all(by.css('.projection-inputs'));
      let actualItems = element.all(by.css('.actual-inputs'));
      let projectionInputValue = element.all(by.css('.projection-inputs input'));
      let actualInputValue = element.all(by.css('.actual-inputs input'));

      expect(element(by.id('add-new-btn')).isDisplayed()).toBeTruthy();
      expect(element(by.id('cancel-btn')).isPresent()).toBeFalsy();
      element(by.id('add-new-btn')).click();
      expect(element(by.id('add-new-btn')).isPresent()).toBeFalsy();
      expect(element(by.id('cancel-btn')).isDisplayed()).toBeTruthy();

      expect(projectionInputs.get(0).isPresent()).toBeTruthy();
      expect(actualItems.get(0).isPresent()).toBeTruthy();
      expect(projectionInputValue.get(0).getAttribute('value')).toEqual('');
      expect(projectionInputValue.get(1).getAttribute('value')).toEqual('0');
      expect(actualInputValue.get(0).getAttribute('value')).toEqual('');
      expect(actualInputValue.get(1).getAttribute('value')).toEqual('0');
    });

    it('should add the new budget item to bottom on list when save button is clicked', () => {
      let projectionInputValue = element.all(by.css('.projection-inputs input'));
      let resultsItems = element.all(by.css('.projection-result'));

      expect(resultsItems.get(0).getText()).toBe('$700.00');
      expect(resultsItems.get(1).getText()).toBe('$1,100.00');
      expect(resultsItems.get(2).getText()).toBe('61%');
      expect(resultsItems.get(3).getText()).toBe('$23,625.00');

      projectionInputValue.get(0).clear();
      projectionInputValue.get(0).sendKeys('Misc');
      projectionInputValue.get(1).clear();
      projectionInputValue.get(1).sendKeys('50');

      element(by.id('save-all')).click();

      let projectionItems = element.all(by.css('.projection'));
      expect(projectionItems.get(3).getText()).toBe('$50.00\nMisc');
      expect(resultsItems.get(0).getText()).toBe('$750.00');
      expect(resultsItems.get(1).getText()).toBe('$1,050.00');
      expect(resultsItems.get(2).getText()).toBe('58%');
      expect(resultsItems.get(3).getText()).toBe('$23,575.00');
    });

    it('should delete the recently created budget item when cancel is clicked', () => {
      let projectionInputs = element.all(by.css('.projection-inputs'));
      let actualItems = element.all(by.css('.actual-inputs'));

      element(by.id('add-new-btn')).click();
      expect(projectionInputs.get(0).isPresent()).toBeTruthy();
      expect(actualItems.get(0).isPresent()).toBeTruthy();
      element(by.id('cancel-btn')).click();
      expect(projectionInputs.get(0).isPresent()).toBeFalsy();
      expect(actualItems.get(0).isPresent()).toBeFalsy();
    });

    it('should add new actual item when + Add button is clicked', () => {
      let addButton = element(by.css('.add-actual'));
      let actualItems = element.all(by.css('.actual'));
      let container = element.all(by.css('.actual-inputs'));
      let inputs = element.all(by.css('.actual-inputs input'));

      actualItems.get(0).click();
      expect(container.get(0).isPresent()).toBeTruthy();
      expect(inputs.get(0).isPresent()).toBeTruthy();
      expect(inputs.get(1).isPresent()).toBeTruthy();
      expect(inputs.get(2).isPresent()).toBeFalsy();
      expect(inputs.get(3).isPresent()).toBeFalsy();
      addButton.click();
      expect(inputs.get(0).isPresent()).toBeTruthy();
      expect(inputs.get(1).isPresent()).toBeTruthy();
      expect(inputs.get(0).getAttribute('value')).toEqual('Done 10/15');
      expect(inputs.get(1).getAttribute('value')).toEqual('35');
      expect(inputs.get(2).isPresent()).toBeTruthy();
      expect(inputs.get(3).isPresent()).toBeTruthy();
      expect(inputs.get(2).getAttribute('value')).toEqual('');
      expect(inputs.get(3).getAttribute('value')).toEqual('0');
    });

    it('should update the total spent value on actual item sub total & overview total spent', () => {
      let actualItems = element.all(by.css('.actual'));
      let inputs = element.all(by.css('.actual-inputs input'));
      let overviewItem = element.all(by.css('h3.overview'));
      let actual = element.all(by.css('.actual'));
      let resultsItems = element.all(by.css('.actual-result'));

      expect(overviewItem.get(2).getText()).toBe('Expense: $290.00');
      expect(actualItems.get(0).getText()).toBe('$35.00\nGas');
      expect(resultsItems.get(0).getText()).toBe('$290.00');
      expect(resultsItems.get(1).getText()).toBe('$1,510.00');
      expect(resultsItems.get(2).getText()).toBe('84%');
      expect(resultsItems.get(3).getText()).toBe('$24,035.00');
      actualItems.get(0).click();
      inputs.get(2).clear();
      inputs.get(2).sendKeys('New Item');
      inputs.get(3).clear();
      inputs.get(3).sendKeys('10');
      expect(inputs.get(2).getAttribute('value')).toEqual('New Item');
      expect(inputs.get(3).getAttribute('value')).toEqual('10');
      expect(overviewItem.get(2).getText()).toBe('Expense: $300.00');
      expect(actual.get(0).getText()).toBe('$45.00\nGas');
      expect(resultsItems.get(0).getText()).toBe('$300.00');
      expect(resultsItems.get(1).getText()).toBe('$1,500.00');
      expect(resultsItems.get(2).getText()).toBe('83%');
      expect(resultsItems.get(3).getText()).toBe('$24,025.00');
    });
  });

  describe('Modal Component Tests', () => {
    it('should show the modal on click of "Start new period" button', () => {
      let button = element(by.id('modal-button'));
      let modal = element(by.id('modal-container'));

      expect(modal.isPresent()).toBeFalsy();
      button.click();
      expect(modal.isPresent()).toBeTruthy();
    });
  });
});
