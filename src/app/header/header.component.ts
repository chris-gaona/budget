import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Budget } from '../budget';
import { BudgetService } from '../budget.service';

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

  // decorator for all budgets for select input drop down
  @Input() budgets: Budget[];

  // decorator for selected budget
  @Input() selectedBudget: Budget;

  // decorator for emitting changed selected budget to other components for use
  @Output() chosenBudget: EventEmitter<Budget> = new EventEmitter<Budget>();

  @Output() changeVisibleBudget: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit() {
  }

  // creates empty budget
  createEmptyBudget() {
    let newBudget = new Budget();
    let newDate = new Date();
    let previousBudget = this.obtainPreviousBudget('pre');

    newBudget.existing_cash = (previousBudget.existing_cash + previousBudget.current_income) - previousBudget.total_spent;
    newBudget.current_income = previousBudget.current_income;
    // make this new budget the shown one in the modal for editing
    this.shownBudget = newBudget;

    this.budgetService.addBudget(newBudget)
      .subscribe(data => {
        console.log('2', data);
        this.budgets.push(data);
        // calls convertDate function & passes in new Date()
        this.convertDate(data, newDate);
        this.shownBudget = data;

        console.log('All budgets', this.budgets);
      }, err => {
        console.log(err);
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
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);

    budget.start_period = newDate;

    this.editingBudget = false;
  }

  // connection function between header component & this component to create new budget
  // connected through @Output decorator
  createBudget(budget) {
    // converts the date string from 2016-10-30 to 10/30/2016
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);
    budget.start_period = newDate;

    // close the modal window on Let's go button clicked
    this.showDialog = false;

    this.budgetService.updateBudgetById(budget._id, budget)
      .subscribe(data => {
        console.log('3', data);
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
      }, err => {
        console.log(err);
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
        console.log('returned deleted data', data);
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
      }, err => {
        console.log(err);
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
        let editableBudget = this.budgets.filter(item => item._id === budgetID).pop();
        // Object.assign(data, editableBudget);
        // was trying to assign chosenBudget to data...don't do that!
        // Needed to find correct budget in this.budgets and make that chosenBudget
        this.updateBudget(editableBudget);
        this.editingBudget = false;
      }, err => {
        console.log(err);
      });
  }

  // reuse projections from last budget
  reuseProjections(budget) {
    console.log('reuse budget', budget);
    let prevProjection;

    // get the budget items
    prevProjection = this.obtainPreviousBudget('post');

    budget.budget_items = prevProjection.budget_items;

    // update the new budget with last period's budget items
    this.budgetService.updateBudgetById(budget._id, budget)
      .subscribe(data => {
        // console.log(data);
        let budgetID = budget._id;
        let editableBudget = this.budgets.filter(item => item._id === budgetID).pop();
        Object.assign(editableBudget, data);
        // was trying to assign chosenBudget to data...don't do that!
        // Needed to find correct budget in this.budgets and make that chosenBudget
        this.updateBudget(editableBudget);
      }, err => {
        console.log(err);
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
        // add amount to totalSpent
        this.totalSpent += +item.actual[j].amount;
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
}
