import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Budget } from '../budget';
import { BudgetService } from '../budget.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  shownBudget: Budget;
  showDialog: boolean;
  reuseProjection: boolean = false;
  totalSpent: number;
  totals: any;
  mergeTotals: number;
  editingBudget: boolean;
  showDeleteButton: boolean = false;
  editableBudget: Budget;
  validationErrors: any;
  hasValidationErrors: boolean = false;

  // decorator for all budgets for select input drop down
  @Input() budgets: Budget[];

  // decorator for selected budget
  @Input() selectedBudget: Budget;

  // decorator for emitting changed selected budget to other components for use
  @Output() chosenBudget: EventEmitter<Budget> = new EventEmitter<Budget>();

  @Output() changeVisibleBudget: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private budgetService: BudgetService, public toastr: ToastsManager) {
  }

  ngOnInit() {
  }

  // creates empty budget
  createEmptyBudget() {
    let newBudget = new Budget();
    let previousBudget = this.obtainPreviousBudget('pre');

    newBudget.existing_cash = (previousBudget.existing_cash + previousBudget.current_income) - previousBudget.total_spent;
    newBudget.current_income = previousBudget.current_income;
    // make this new budget the shown one in the modal for editing
    this.shownBudget = newBudget;

    this.budgetService.addBudget(newBudget)
      .subscribe(data => {
        this.budgets.push(data);
        // calls convertDate function & passes in new Date()
        this.convertDate(data, data.start_period);
        this.shownBudget = data;
      }, err => {
        this.handleError(err);
        console.error(err);
      });
  }

  // converts date string to 2016-10-29
  convertDate(budget, date) {
    date = new Date(date);
    let dateString;

    if ((date.getMonth() + 1) < 10 && date.getDate() < 10) {
      dateString = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-0' + date.getDate();

    } else if ((date.getMonth() + 1) < 10 && date.getDate() >= 10) {
      dateString = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate();

    } else if ((date.getMonth() + 1) >= 10 && date.getDate() < 10) {
      dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-0' + date.getDate();

    } else {
      dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
    // converts new date to proper string to be handled by date type input
    return budget.start_period = dateString;
  }

  reverseDate(budget) {
    console.log('reverse date', budget);
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);

    budget.start_period = newDate;

    this.editingBudget = false;
  }

  // connection function between header component & this component to create new budget
  // connected through @Output decorator
  createBudget(budget) {
    console.log('budget', budget);

    // converts the date string from 2016-10-30 to 10/30/2016
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);
    budget.start_period = newDate;

    this.budgetService.updateBudgetById(budget._id, budget)
      .subscribe(data => {
        // console.log('created budget', data);
        if (this.reuseProjection === false) {
          let budgetID = budget._id;
          // Handle the event & add change to selected budget
          let editableBudget = this.budgets.filter(item => item._id === budgetID).pop();
          Object.assign(editableBudget, data);
          // was trying to assign chosenBudget to data...don't do that!
          // Needed to find correct budget in this.budgets and make that chosenBudget
          this.updateBudget(editableBudget);

        } else {
          this.reuseProjections(budget);
        }

        this.reuseProjection = false;
        // close the modal window on Let's go button clicked
        this.showDialog = false;

        this.hasValidationErrors = false;

        // this.toastr.success('Budget Created', 'Success!');
      }, err => {
        this.handleError(err);
        console.error(err);
      });
  }

  // updatedBudget function passes in the $event of the select input binding with (ngModuleChange)
  updateBudget(budget) {
    // using the @Output decorator above, emit the chosen budget to the outside world
    this.chosenBudget.emit(budget);
    this.showDialog = false;
  }

  cancelBudget() {
    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the newly created last budget item in the array
      if (i === (this.budgets.length - 1)) {
        // remove the budget
        this.deleteBudget(this.budgets[i]);
      }
    }
  }

  deleteBudget(budget) {
    this.budgetService.deleteBudgetById(budget._id)
      .subscribe(data => {
        let newIndex = 0;

        this.budgets.filter((item, i) => {
          if (item._id === budget._id) {
            this.budgets.splice(i, 1);
            newIndex = i - 1;
          }
        });

        if (this.budgets.length > 0) {
          this.shownBudget = this.budgets[newIndex];
          this.updateBudget(this.shownBudget);
        } else {
          this.changeVisibleBudget.emit(false);
        }

        this.hasValidationErrors = false;

        // this.toastr.success('Budget Deleted', 'Success!');
      }, err => {
        this.handleError(err);
        console.error(err);
      });
  }

  editBudget(budget) {
    this.convertDate(budget, budget.start_period);
    this.shownBudget = budget;
  }

  addUpdate(budget) {
    // converts the date string from 2016-10-30 to 10/30/2016
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);
    budget.start_period = newDate;

    // update the new budget with last period's budget items
    this.budgetService.updateBudgetById(budget._id, budget)
      .subscribe(data => {
        // console.log(data);
        let budgetID = budget._id;
        this.editableBudget = this.budgets.filter(item => item._id === budgetID).pop();
        // Object.assign(data, editableBudget);
        // was trying to assign chosenBudget to data...don't do that!
        // Needed to find correct budget in this.budgets and make that chosenBudget
        this.updateBudget(this.editableBudget);
        this.editingBudget = false;
        this.hasValidationErrors = false;
        // this.toastr.success('Budget Updated', 'Success!');
      }, err => {
        this.handleError(err);
        console.error(err);
      });
  }

  // reuse projections from last budget
  reuseProjections(budget) {
    let prevProjection;

    // get the budget items
    prevProjection = this.obtainPreviousBudget('post');

    budget.budget_items = prevProjection.budget_items;

    // update the new budget with last period's budget items
    this.budgetService.updateBudgetById(budget._id, budget)
      .subscribe(data => {
        // console.log(data);
        let budgetID = budget._id;
        this.editableBudget = this.budgets.filter(item => item._id === budgetID).pop();
        // Object.assign(this.editableBudget, data);
        // was trying to assign chosenBudget to data...don't do that!
        // Needed to find correct budget in this.budgets and make that chosenBudget
        this.updateBudget(this.editableBudget);
      }, err => {
        this.handleError(err);
        console.error(err);
      });
  }

  // get the projection or budget items from last period
  obtainPreviousBudget(string) {
    let budgetItems;
    let prevBudget;

    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the budget that was created last week
      if (string === 'post') {
        if (i === (this.budgets.length - 2)) {
          // assign the last budget to shownBudget variable
          budgetItems = this.budgets[i];
        }
      } else if (string === 'pre') {
        if (i === (this.budgets.length - 1)) {
          // assign the last budget to shownBudget variable
          budgetItems = this.budgets[i];
        }
      }
    }

    // use a hack to make a deep copy of an array
    prevBudget = JSON.parse(JSON.stringify(budgetItems));

    prevBudget.total_spent = this.getActualTotals(prevBudget.budget_items);

    // loop through to remove all the actual values
    for (let i = 0; i < prevBudget.budget_items.length; i++) {
      prevBudget.budget_items[i].actual = [];
    }

    // return the new budget_items array to use in the new budget
    return prevBudget;
  }

  getActualTotals(budgetItems) {
    // initialize totalSpent to 0
    this.totalSpent = 0;
    // initialize totals variable to empty array
    this.totals = [];
    // initialize mergeTotals to 0
    this.mergeTotals = 0;

    // loop through each item in budget_items
    for (let i = 0; i < budgetItems.length; i++) {
      let item = budgetItems[i];
      // for each budget_item, loop through the actual array
      for (let j = 0; j < item.actual.length; j++) {
        if (item.actual[j].expense === true) {
          // add amount to totalSpent
          this.totalSpent += +item.actual[j].amount;
        } else {
          // subtract amount to totalSpent
          this.totalSpent -= +item.actual[j].amount;
        }
      }
    }

    // push totalSpent total to totals array
    this.totals.push(this.totalSpent);

    // loop through the totals array
    for (let i = 0; i < this.totals.length; i++) {
      // merge the total together
      this.mergeTotals += +this.totals[i];
    }
    return this.mergeTotals;
  }

  parseDate(date: string) {
    // parses a string representation of a date, &
    // returns the number of milliseconds since
    // January 1, 1970
    let systemDate: any = new Date(Date.parse(date));
    // gets today's date
    let userDate: any = new Date();
    // splits date string at space into array with
    // each word
    let dateToSplit: any = new Date(date).toDateString();
    let splitDate: any = dateToSplit.split(' ');
    // gets difference between twitter date & user date
    // divide the value by 1000 to change milliseconds
    // into seconds
    let diff = Math.floor((userDate - systemDate) / 1000);

    // adds text depending on how many seconds the diff is
    // booleanValue is used to deterime to put text in
    // timeline section or direct messages section
    if (diff <= 1) { return 'just now'; }

    if (diff < 60) { return diff + ' seconds ago'; }

    if (diff <= 90) { return 'one minute ago'; }

    if (diff <= 3540) { return Math.round(diff / 60) + ' minutes ago'; }

    if (diff <= 5400) { return '1 hour ago'; }

    if (diff <= 86400) { return Math.round(diff / 3600) + ' hours ago'; }

    if (diff <= 129600) { return '1 day ago'; }

    if (diff < 604800) { return Math.round(diff / 86400) + ' days ago'; }

    if (diff <= 777600) { return '1 week ago'; }

    // if none of the above return true show actual date
    return splitDate[1] + ' ' + splitDate[2];
  }

  private handleError(error: any) {
    // if the error has status 400 meaning there are form issues
    if (error.status === 400) {
      // tell user to fix the form issues
      this.toastr.error('Please see above.', 'Form Errors!');
      console.log('response', error);
      this.hasValidationErrors = true;
      this.validationErrors = error;
    } else {
      // else display the message to the user
      let message = error && error.statusText;

      if (message) {
        this.toastr.error(message, 'Uh oh!');
      } else {
        message = 'Message not available.';
        this.toastr.error(message, 'Unexpected Error');
      }

      // log the entire response to the console
      console.error(error);
    }
  }
}
