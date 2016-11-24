import { browser, element, by, protractor } from "protractor";
import {el} from "@angular/platform-browser/testing/browser_util";

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
      expect(element(by.css('.lead')).getText()).toEqual('A simple budget tracker built with & !');
    });
  });

  describe('User not logged in text', () => {
    it('should show specific text saying user is not logged in', () => {
      expect(element(by.id('logged-out')).getText()).toEqual('You are not logged in, please click the \'Log In\' button to get started');
    });

    it('should have a Log In button', () => {
      let button = element(by.id('login'));
      expect(button.isPresent()).toBeTruthy();
      expect(button.getText()).toEqual('Log In');
    });

    it('should display the css dog animation', () => {
      expect(element(by.css('.dog-container')).isPresent()).toBeTruthy();
    });
  });

  describe('Initial modal for login / register', () => {
    it('should show the modal window to login', () => {
      let button = element(by.id('login'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
      button.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeTruthy();
      expect(overlay.isPresent()).toBeTruthy();
    });

    it('Login modal should show specific text', () => {
      expect(element(by.css('.modal-title')).getText()).toEqual('Log In');
      expect(element(by.css('.modal-body small')).getText()).toEqual('Please login below to start your adventure!');
      expect(element.all(by.css('label')).get(0).getText()).toEqual('Username');
      expect(element.all(by.css('label')).get(1).getText()).toEqual('Password');
      expect(element(by.id('login-button')).getText()).toEqual('Log In');
      expect(element(by.id('signup-button')).getText()).toEqual('Sign Up');
      expect(element(by.id('cancel-button')).getText()).toEqual('Close');
    });

    it('should switch to register modal when singup button clicked & switch back', () => {
      let signupButton = element(by.id('signup-button'));
      let signInButton = element(by.id('signin-button'));
      signupButton.click();
      browser.sleep(500);
      expect(element(by.css('.modal-title')).getText()).toEqual('Sign Up Now!');
      expect(element(by.css('.modal-body small')).getText()).toEqual('The power to register is in your hands now!');
      expect(element.all(by.css('label')).get(0).getText()).toEqual('First Name');
      expect(element.all(by.css('label')).get(1).getText()).toEqual('Username');
      expect(element.all(by.css('label')).get(2).getText()).toEqual('Password');
      expect(element.all(by.css('label')).get(3).getText()).toEqual('Confirm Password');
      signInButton.click();
      browser.sleep(500);
      expect(element(by.css('.modal-title')).getText()).toEqual('Log In');
    });

    it('should close the modal on close button clicked', () => {
      let closeButton = element(by.id('cancel-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      closeButton.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
    });

    // NOT USING THIS BECAUSE I HAVE NOT CURRENT WAY TO EASILY DELETE USERS
    // it('should register a new user', () => {
    //   let button = element(by.id('login'));
    //   let signupButton = element(by.id('signup-button'));
    //   let input = element.all(by.css('.modal-body input'));
    //   let registerButton = element(by.id('register-button'));
    //   let modal = element(by.id('modal-container'));
    //   let overlay = element(by.css('.overlay'));
    //
    //   button.click();
    //   browser.sleep(500);
    //   signupButton.click();
    //   browser.sleep(500);
    //   input.get(0).sendKeys('Jason');
    //   input.get(1).sendKeys('jimbo123');
    //   input.get(2).sendKeys('password');
    //   input.get(3).sendKeys('password');
    //   registerButton.click();
    //   browser.sleep(500);
    //   expect(modal.isPresent()).toBeFalsy();
    //   expect(overlay.isPresent()).toBeFalsy();
    // });

    it('should login an existing users', () => {
      let button = element(by.id('login'));
      let input = element.all(by.css('.modal-body input'));
      let loginButton = element(by.id('login-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      button.click();
      browser.sleep(500);
      input.get(0).sendKeys('jdog123');
      input.get(1).sendKeys('password');
      loginButton.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
    });
  });

  describe('User has logged in or registered & has no existing budgets', () => {
    it('should show text displaying current user\'s name', () => {
      expect(element(by.id('user-info')).getText()).toEqual('Hello, Jason');
    });

    it('should show a logout button', () => {
      expect(element(by.id('logout-button')).isPresent()).toBeTruthy();
      expect(element(by.id('logout-button')).getText()).toEqual('Logout');
    });

    it('should show a start new budget button', () => {
      expect(element(by.id('new-budget')).getText()).toEqual('START NEW BUDGET');
    });
  });

  describe('After START NEW BUDGET button is clicked', () => {
    it('should remove the button & add a health snapshot section', () => {
      let button = element(by.id('new-budget'));

      button.click();
      browser.sleep(500);
      expect(element(by.css('.snapshot-pill')).isPresent()).toBeTruthy();
      expect(element(by.css('.health-snapshot')).getText()).toEqual('HEALTH SNAPSHOT');
    });

    it('should remove the css dog animation', () => {
      expect(element(by.css('.dog-container')).isPresent()).toBeFalsy();
    });
  });

  describe('Header Component', () => {
    it('should display the Start New Period button', () => {
      let button = element(by.id('modal-button'));
      expect(button.isPresent()).toBeTruthy();
      expect(button.getText()).toEqual('START NEW PERIOD');
    });

    it('should display option value as the selected budget from data', () => {
      expect(element(by.css('select')).element(by.css('option:checked')).isDisplayed()).toBeTruthy();
      // element(by.cssContainingText('option', 'Sep 24, 2016')).click();
      // expect(element(by.css('select')).element(by.css('option:checked')).getText()).toEqual('Sep 24, 2016');
    });

    it('should display the Edit button', () => {
      let button = element(by.id('edit-button'));
      expect(button.isPresent()).toBeTruthy();
      expect(button.getText()).toEqual('Edit');
    });
  });

  describe('Overview Component on initial budget creation', () => {
    it('should display overview sections with correct dollar values based on budget selected', () => {
      let overviewItem = element.all(by.css('h3.overview'));
      expect(overviewItem.get(0).getText()).toBe('Total: $0.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $0.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $0.00');

      // element(by.cssContainingText('option', 'Oct 5, 2016')).click();
      //
      // expect(overviewItem.get(0).getText()).toBe('Total: $25,525.00');
      // expect(overviewItem.get(1).getText()).toBe('Income: $1,650.00');
      // expect(overviewItem.get(2).getText()).toBe('Expense: $437.00');
      //
      // element(by.cssContainingText('option', 'Sep 24, 2016')).click();
    });

    it('should have 0 for projection & 0 for actual', () => {
      let projectionItems = element.all(by.css('.projection'));
      let actualItems = element.all(by.css('.actual'));

      expect(projectionItems.get(0).getText()).toBe('$0.00');
      expect(actualItems.get(0).getText()).toBe('$0.00');
    });
  });

  describe('Modal Component Tests When Editing Existing Budget', () => {
    it('should show the modal on click of Edit button', () => {
      let editButton = element(by.id('edit-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
      editButton.click();
      expect(modal.isPresent()).toBeTruthy();
      expect(overlay.isPresent()).toBeTruthy();
    });

    it('should display a modal tile and info text correctly', () => {
      // makes browser sleep for .5 seconds to give modal time to load for following tests
      browser.sleep(500);
      expect(element(by.css('.modal-title')).getText()).toEqual('Let\'s make some changes');
      expect(element(by.css('.modal-body small')).getText()).toEqual('Please be careful while editing. I take no responsibility for your mistakes.')
    });

    let label = element.all(by.css('label'));

    it('should have current period field', () => {
      expect(label.get(0).getText()).toEqual('When does the current period start?');
      expect(element(by.id('formGroupInput')).getAttribute('value')).toBeTruthy();
    });

    it('should have current total cash field', () => {
      expect(label.get(1).getText()).toEqual('What\'s your current total cash?');
      expect(element(by.id('formGroupInput2')).getAttribute('value')).toBeTruthy();
    });

    it('should have current income field', () => {
      expect(label.get(2).getText()).toEqual('What\'s your current income?');
      expect(element(by.id('formGroupInput3')).getAttribute('value')).toBeTruthy();
    });

    // it('should delete the current editing budget when delete button is clicked & remove the modal', () => {
    //   let deleteAskButton = element(by.id('delete-ask-button'));
    //   let deleteButton = element(by.id('delete-button'));
    //   expect(deleteButton.isPresent()).toBeFalsy();
    //   deleteAskButton.click();
    //   expect(deleteButton.isPresent()).toBeTruthy();
    //   deleteButton.click();
    //   let modal = element(by.id('modal-container'));
    //   let overlay = element(by.css('.overlay'));
    //
    //   browser.sleep(500);
    //
    //   expect(modal.isPresent()).toBeFalsy();
    //   expect(overlay.isPresent()).toBeFalsy();
    // });

    it('should close the modal on click of X icon & cancel button', () => {
      let editButton = element(by.id('edit-button'));
      let cancel = element(by.id('cancel-button'));
      let xButton = element(by.css('.close span'));
      // let button = element(by.id('modal-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      // editButton.click();
      //
      // browser.sleep(500);

      expect(cancel.getText()).toEqual('Close');
      cancel.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
      editButton.click();
      expect(modal.isPresent()).toBeTruthy();
      expect(overlay.isPresent()).toBeTruthy();
      browser.sleep(500);
      xButton.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
      editButton.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeTruthy();
      expect(overlay.isPresent()).toBeTruthy();
    });

    // it('should remove the modal when Let\'s go button is clicked', () => {
    //   let createButton = element(by.id('create-button'));
    //   let modal = element(by.id('modal-container'));
    //   let overlay = element(by.css('.overlay'));
    //   let editButton = element(by.id('edit-button'));
    //   let deleteAskButton = element(by.id('delete-ask-button'));
    //   let deleteButton = element(by.id('delete-button'));
    //
    //   browser.sleep(500);
    //   createButton.click();
    //   browser.sleep(500);
    //   expect(modal.isPresent()).toBeFalsy();
    //   expect(overlay.isPresent()).toBeFalsy();
    //   editButton.click();
    //   browser.sleep(500);
    //   deleteAskButton.click();
    //   deleteButton.click();
    // });

    it('should display entered input data on main page when update button is clicked', () => {
      // let input1 = element(by.id('formGroupInput'));
      let input2 = element(by.id('formGroupInput2'));
      let input3 = element(by.id('formGroupInput3'));
      // let button = element(by.id('modal-button'));
      let updateButton = element(by.id('update-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      // button.click();
      // browser.sleep(500);

      // input1.clear();
      // input1.sendKeys('2016-10-29');
      input2.clear();
      input2.sendKeys('26000');
      input3.clear();
      input3.sendKeys('1800');

      // expect(element(by.id('formGroupInput')).getAttribute('value')).toEqual('2016-10-29');
      expect(element(by.id('formGroupInput2')).getAttribute('value')).toEqual('26000');
      expect(element(by.id('formGroupInput3')).getAttribute('value')).toEqual('1800');

      updateButton.click();
      browser.sleep(500);

      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();

      let overviewItem = element.all(by.css('h3.overview'));
      expect(overviewItem.get(0).getText()).toBe('Total: $26,000.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $1,800.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $0.00');
    });
  });

  describe('Projection / Actual - Main Section Tests', () => {
//     it('should display correct projection items based on budget selected', () => {
//       let projectionItems = element.all(by.css('.projection'));
//       expect(projectionItems.get(0).getText()).toBe('$200.00\nGas');
//       expect(projectionItems.get(1).getText()).toBe('$250.00\nFood');
//       expect(projectionItems.get(2).getText()).toBe('$250.00\nOther');
//     });
//
//     it('should display correct actual items based on budget selected', () => {
//       let actualItems = element.all(by.css('.actual'));
//       expect(actualItems.get(0).getText()).toBe('$35.00\nGas');
//       expect(actualItems.get(1).getText()).toBe('$180.00\nFood');
//       expect(actualItems.get(2).getText()).toBe('$75.00\nOther');
//     });
//
    it('should display correct result information for new empty budget', () => {
      let resultsItems = element.all(by.css('.projection-result'));

      expect(resultsItems.get(0).getText()).toBe('$0.00');
      expect(resultsItems.get(1).getText()).toBe('$1,800.00');
      expect(resultsItems.get(2).getText()).toBe('100%');
      expect(resultsItems.get(3).getText()).toBe('$27,800.00');
    });

    it('should have input fields in projection & actual hidden as default', () => {
      let projectionItems = element.all(by.css('.projection-inputs'));
      let actualItems = element.all(by.css('.actual-inputs'));
      expect(projectionItems.get(0).isPresent()).toBeFalsy();
      expect(actualItems.get(0).isPresent()).toBeFalsy();
    });

    it('should be able to edit existing budget item on click', () => {
      let projectionItems = element.all(by.css('.projection'));
      let projectionInputValue = element.all(by.css('.projection-inputs input'));
      let actualInputsValue = element.all(by.css('.actual-inputs input'));

      projectionItems.get(0).click();
      projectionInputValue.get(0).clear();
      projectionInputValue.sendKeys('Misc');
      projectionInputValue.get(1).clear();
      projectionInputValue.get(1).sendKeys('150');

      expect(projectionInputValue.get(0).getAttribute('value')).toEqual('Misc');
      expect(projectionInputValue.get(1).getAttribute('value')).toEqual('150');

      actualInputsValue.get(0).clear();
      actualInputsValue.get(0).sendKeys('New Item');
      actualInputsValue.get(1).clear();
      actualInputsValue.get(1).sendKeys('100');

      expect(actualInputsValue.get(0).getAttribute('value')).toEqual('New Item');
      expect(actualInputsValue.get(1).getAttribute('value')).toEqual('100');
    });

    it('should add new actual item when + Add button is clicked', () => {
      let addButton = element(by.css('.add-actual'));
      let actualItems = element.all(by.css('.actual'));
      let container = element.all(by.css('.actual-inputs'));
      let actualInputsValue = element.all(by.css('.actual-inputs input'));

      // actualItems.get(0).click();
      // expect(container.get(0).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(0).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(1).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(2).isPresent()).toBeFalsy();
      expect(actualInputsValue.get(3).isPresent()).toBeFalsy();
      addButton.click();
      expect(actualInputsValue.get(0).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(1).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(0).getAttribute('value')).toEqual('New Item');
      expect(actualInputsValue.get(1).getAttribute('value')).toEqual('100');
      expect(actualInputsValue.get(2).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(3).isPresent()).toBeTruthy();
      expect(actualInputsValue.get(2).getAttribute('value')).toEqual('');
      expect(actualInputsValue.get(3).getAttribute('value')).toEqual('0');
    });

    it('should add a new editable budget/actual item on +Add New button click', () => {
      let projectionItems = element.all(by.css('.projection-inputs'));
      let actualItems = element.all(by.css('.actual-inputs'));
      let projectionInputValue = element.all(by.css('.projection-inputs input'));
      let actualInputValue = element.all(by.css('.actual-inputs input'));

      expect(element(by.id('add-new-btn')).isDisplayed()).toBeTruthy();
      element(by.id('add-new-btn')).click();

      expect(projectionItems.get(0).isPresent()).toBeTruthy();
      expect(actualItems.get(0).isPresent()).toBeTruthy();
      expect(projectionInputValue.get(2).getAttribute('value')).toEqual('');
      expect(projectionInputValue.get(3).getAttribute('value')).toEqual('0');
      expect(actualInputValue.get(2).getAttribute('value')).toEqual('');
      expect(actualInputValue.get(3).getAttribute('value')).toEqual('0');
    });

    it('should add the new budget item to bottom on list when save button is clicked', () => {
      let projectionInputValue = element.all(by.css('.projection-inputs input'));
      let resultsItems = element.all(by.css('.projection-result'));

      expect(resultsItems.get(0).getText()).toBe('$150.00');
      expect(resultsItems.get(1).getText()).toBe('$1,650.00');
      expect(resultsItems.get(2).getText()).toBe('92%');
      expect(resultsItems.get(3).getText()).toBe('$27,650.00');

      projectionInputValue.get(2).clear();
      projectionInputValue.get(2).sendKeys('Food');
      projectionInputValue.get(3).clear();
      projectionInputValue.get(3).sendKeys('150');

      element(by.id('save-all')).click();

      let projectionItems = element.all(by.css('.projection'));
      expect(projectionItems.get(0).getText()).toBe('$150.00\nMisc');
      expect(projectionItems.get(1).getText()).toBe('$150.00\nFood');
      expect(resultsItems.get(0).getText()).toBe('$300.00');
      expect(resultsItems.get(1).getText()).toBe('$1,500.00');
      expect(resultsItems.get(2).getText()).toBe('83%');
      expect(resultsItems.get(3).getText()).toBe('$27,500.00');
    });

    it('should delete an existing budget item', () => {
      let projectionItems = element.all(by.css('.projection'));
      let deleteButton = element.all(by.css('.delete-button'));

      projectionItems.get(1).click();
      deleteButton.get(0).click();
      element(by.id('save-all')).click();
      expect(projectionItems.get(1).isPresent()).toBeFalsy();
    });
  });

  describe('Modal Component Tests When Creating New Budget', () => {
    it('should show the modal on click of "Start new period" button', () => {
      let button = element(by.id('modal-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();
      button.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeTruthy();
      expect(overlay.isPresent()).toBeTruthy();
    });

    it('should display a modal title and info text', () => {
      // makes browser sleep for .5 seconds to give modal time to load for following tests
      browser.sleep(500);
      expect(element(by.css('.modal-title')).getText()).toEqual('You just got paid...time to track it!');
      expect(element(by.css('.modal-body small')).getText()).toEqual('I\'ve done my best to populate the following fields for you. Your welcome!')
    });

    let label = element.all(by.css('label'));

    it('should have current period field', () => {
      expect(label.get(0).getText()).toEqual('When does the current period start?');
      expect(element(by.id('formGroupInput')).getAttribute('value')).toBeTruthy();
    });

    it('should have current total cash field', () => {
      expect(label.get(1).getText()).toEqual('What\'s your current total cash?');
      expect(element(by.id('formGroupInput2')).getAttribute('value')).toBeTruthy();
    });

    it('should have current income field', () => {
      expect(label.get(2).getText()).toEqual('What\'s your current income?');
      expect(element(by.id('formGroupInput3')).getAttribute('value')).toBeTruthy();
    });

    it('should allow the user to check to use previous projections', () => {
      let checkbox = element(by.css('.custom-control-input'));
      let checkboxLabel = element(by.css('.custom-checkbox'));

      expect(checkbox.isSelected()).toBeFalsy();
      checkboxLabel.click();
      expect(checkbox.isSelected()).toBeTruthy();
    });

    it('should remove the modal when Let\'s go button is clicked', () => {
      let createButton = element(by.id('create-button'));
      let modal = element(by.id('modal-container'));
      let overlay = element(by.css('.overlay'));

      browser.sleep(500);
      createButton.click();
      browser.sleep(500);
      expect(modal.isPresent()).toBeFalsy();
      expect(overlay.isPresent()).toBeFalsy();

      let editButton = element(by.id('edit-button'));
      let deleteAskButton = element(by.id('delete-ask-button'));
      let deleteButton = element(by.id('delete-button'));

      editButton.click();
      browser.sleep(500);
      deleteAskButton.click();
      deleteButton.click();
      browser.sleep(500);
    });

    it('should display entered input data on main page when create button is clicked WITHOUT checking use last projection checkbox', () => {
      // let input1 = element(by.id('formGroupInput'));
      let input2 = element(by.id('formGroupInput2'));
      let input3 = element(by.id('formGroupInput3'));
      let button = element(by.id('modal-button'));
      let createButton = element(by.id('create-button'));

      button.click();
      browser.sleep(500);

      // input1.clear();
      // input1.sendKeys('2016-10-29');
      input2.clear();
      input2.sendKeys('26000');
      input3.clear();
      input3.sendKeys('1800');

      // expect(element(by.id('formGroupInput')).getAttribute('value')).toEqual('2016-10-29');
      expect(element(by.id('formGroupInput2')).getAttribute('value')).toEqual('26000');
      expect(element(by.id('formGroupInput3')).getAttribute('value')).toEqual('1800');

      let checkbox = element(by.css('.custom-control-input'));

      expect(checkbox.isSelected()).toBeFalsy();

      createButton.click();
      browser.sleep(500);

      let overviewItem = element.all(by.css('h3.overview'));
      expect(overviewItem.get(0).getText()).toBe('Total: $26,000.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $1,800.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $0.00');

      let editButton = element(by.id('edit-button'));
      let deleteAskButton = element(by.id('delete-ask-button'));
      let deleteButton = element(by.id('delete-button'));
      editButton.click();
      browser.sleep(500);
      deleteAskButton.click();
      deleteButton.click();
      browser.sleep(500);
    });

    it('should display entered input data on main page when create button is clicked WITH checking use last projection checkbox', () => {
      // let input1 = element(by.id('formGroupInput'));
      let input2 = element(by.id('formGroupInput2'));
      let input3 = element(by.id('formGroupInput3'));
      let button = element(by.id('modal-button'));
      let createButton = element(by.id('create-button'));

      button.click();
      browser.sleep(500);

      // input1.clear();
      // input1.sendKeys('2016-10-29');
      input2.clear();
      input2.sendKeys('26000');
      input3.clear();
      input3.sendKeys('1800');

      // expect(element(by.id('formGroupInput')).getAttribute('value')).toEqual('2016-10-29');
      expect(element(by.id('formGroupInput2')).getAttribute('value')).toEqual('26000');
      expect(element(by.id('formGroupInput3')).getAttribute('value')).toEqual('1800');

      let checkbox = element(by.css('.custom-control-input'));
      let checkboxLabel = element(by.css('.custom-checkbox'));

      expect(checkbox.isSelected()).toBeFalsy();
      checkboxLabel.click();
      expect(checkbox.isSelected()).toBeTruthy();

      createButton.click();
      browser.sleep(500);

      let overviewItem = element.all(by.css('h3.overview'));
      expect(overviewItem.get(0).getText()).toBe('Total: $26,000.00');
      expect(overviewItem.get(1).getText()).toBe('Income: $1,800.00');
      expect(overviewItem.get(2).getText()).toBe('Expense: $0.00');

      // checks to make sure the projection items and actual items match the last budget's projections, but actuals should all be 0
      let projectionItems = element.all(by.css('.projection'));
      expect(projectionItems.get(0).getText()).toBe('$150.00\nMisc');

      let actualItems = element.all(by.css('.actual'));
      expect(actualItems.get(0).getText()).toBe('$0.00\nMisc');

      let editButton = element(by.id('edit-button'));
      let deleteAskButton = element(by.id('delete-ask-button'));
      let deleteButton = element(by.id('delete-button'));
      editButton.click();
      browser.sleep(500);
      deleteAskButton.click();
      deleteButton.click();
      browser.sleep(500);
    });

    it('should delete the entire budget created', () => {
      let editButton = element(by.id('edit-button'));
      let deleteAskButton = element(by.id('delete-ask-button'));
      let deleteButton = element(by.id('delete-button'));

      editButton.click();
      browser.sleep(500);
      deleteAskButton.click();
      deleteButton.click();
      browser.sleep(500);
    });
  });

  // todo: test logout button
  describe('Logout the user', () => {
    it('should log out the currently logged in user', () => {
      let logoutButton = element(by.id('logout-button'));

      logoutButton.click();
    });

    it('should show specific text saying user is not logged in', () => {
      expect(element(by.id('logged-out')).getText()).toEqual('You are not logged in, please click the \'Log In\' button to get started');
    });

    it('should have a Log In button', () => {
      let button = element(by.id('login'));
      expect(button.isPresent()).toBeTruthy();
      expect(button.getText()).toEqual('Log In');
    });

    it('should display the css dog animation', () => {
      expect(element(by.css('.dog-container')).isPresent()).toBeTruthy();
    });
  });
});
