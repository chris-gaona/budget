import { Component, OnInit } from '@angular/core';
import { BudgetService } from './budget.service';
import { Budget, BudgetItems, ActualItems } from './budget';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // defines all typescript variables & their types
  title: string = 'Budget Tracker';
  budgets: Budget[];
  selectedBudget: Budget;
  totalActual: number;
  totalSpent: number;
  totals: any;
  mergeTotals: number;
  addingBudgetItem: boolean = false;
  projectionObject: Object = {};
  actualObject: Object = {};
  totalSaving: number;
  percSaving: number;
  endingCash: number;
  showDialog: boolean;
  currentUser: string;

  // injects budget service into this component
  constructor(private budgetService: BudgetService, private userService: UserService) { }

  // on initialization of the app
  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.loggedInUser();
    }
    this.getAllBudgets();

    console.log(this.userService.isLoggedIn());
  }

  loggedInUser() {
    this.userService.getUser()
      .subscribe(data => {
        this.currentUser = data;
        console.log('data', data);
      }, err => {
        console.log(err);
      });
  }

  getAllBudgets() {
    // retrieves all budgets from budgetService
    this.budgetService.getAllBudgets()
      .subscribe(data => {
        this.budgets = data;
        // loop through each budget entry
        for (let i = 0; i < this.budgets.length; i++) {
          // find the latest created budget entry in the array
          if (i === (this.budgets.length - 1)) {
            // make that one the selected budget on load
            this.selectedBudget = this.budgets[i];
          }
        }
      }, err => {
        console.log(err);
      });
  }

  // connection function between header component & this component to change the selected budget
  // connected through @Output decorator
  chosenBudget(budget) {
    // Handle the event & add change to selected budget
    this.selectedBudget = budget;
  }

  // save all edits
  saveAll() {
    // changes cancel button to + add new
    this.addingBudgetItem = false;
    let budget = this.selectedBudget._id;
    // loop through all budget items
    for (let i = 0; i < this.selectedBudget.budget_items.length; i++) {
      // mark each budget item as editing false
      this.selectedBudget.budget_items[i].editing = false;
    }
    // passes budget_items array to saveAll function on budgetService
    this.budgetService.updateBudgetById(budget, this.selectedBudget)
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
    // todo: remove actual items with empty string on save
  }

  // add new budget item to budget_items array in specific budget
  addBudgetItem() {
    // create a new budget item using defined types
    let newBudgetItem = new BudgetItems();
    // make new budget item editable to start with
    newBudgetItem.editing = true;
    // add the new budget item to the array
    this.selectedBudget.budget_items.push(newBudgetItem);
  }

  // delete specific budget item
  deleteBudgetItem(budgetItem) {
    let budget = this.selectedBudget.budget_items;
    // loop through budget_items
    for (let i = 0; i < budget.length; i++) {
      // if a match to the budget passed in
      if (budget[i] === budgetItem) {
        // remove it
        budget.splice(i, 1);
      }
    }
  }

  // add new actual item to actual array under specific budget_items
  // pass in which actual array we want to add to
  addActualItem(actual) {
    // create a new actual item using the defined types
    let newActualItem = new ActualItems();
    // add that item to the array
    actual.push(newActualItem);
  }

  // delete specific actual item
  // pass in the specific budget_item & the actual item within that budget_item
  deleteActual(budget, actual) {
    // loop through the actual array
    for (let i = 0; i < budget.actual.length; i++) {
      // if a match to the actual passed in
      if (budget.actual[i] === actual) {
        // remove it
        budget.actual.splice(i, 1);
      }
    }
  }

  // calculates the sub total for each budget_item
  getActualTotal(budget) {
    // initialize totalActual to 0
    this.totalActual = 0;
    // loop through each actual item in the array
    for (let i = 0; i < budget.actual.length; i++) {
      // add each amount to the total
      this.totalActual += +budget.actual[i].amount;
    }
    // return the total calculated
    return this.totalActual;
  }

  // calculates total spent for entire budget
  getTotalSpent(budget, type) {
    // initialize totalSpent to 0
    this.totalSpent = 0;
    // initialize totals variable to empty array
    this.totals = [];
    // initialize mergeTotals to 0
    this.mergeTotals = 0;

    if (type === 'actual') {
      // loop through each item in budget_items
      for (let i = 0; i < budget.length; i++) {
        let item = budget[i];
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

      // total saving
      this.totalSaving = this.selectedBudget.current_income - this.mergeTotals;

      // percentage saving
      this.percSaving = this.totalSaving / this.selectedBudget.current_income;

      // ending cash amount
      this.endingCash = this.selectedBudget.existing_cash + this.selectedBudget.current_income - this.mergeTotals;

      this.actualObject = Object.assign({}, {
        totalSpent: this.mergeTotals,
        totalSaving: this.totalSaving,
        percSaving: this.percSaving,
        endingCash: this.endingCash
      });

      // return the total spent number for the entire budget
      return this.actualObject;

    } else if (type === 'projection') {
      // loop through each item in budget_items
      for (let i = 0; i < budget.length; i++) {
        this.totalSpent += +budget[i].projection;
      }

      // total saving
      this.totalSaving = this.selectedBudget.current_income - this.totalSpent;

      // percentage saving
      this.percSaving = this.totalSaving / this.selectedBudget.current_income;

      // ending cash amount
      this.endingCash = this.selectedBudget.existing_cash + this.selectedBudget.current_income - this.totalSpent;

      this.projectionObject = Object.assign({}, {
        totalSpent: this.totalSpent,
        totalSaving: this.totalSaving,
        percSaving: this.percSaving,
        endingCash: this.endingCash
      });

      return this.projectionObject;
    }
  }

  login(username, password) {
    this.userService.login(username, password).subscribe((result) => {
      if (result) {
        console.log(result);
        this.showDialog = false;
      }
    });
  }

  signUp(username, password, confirmPassword, firstName) {
    this.userService.register(username, password, confirmPassword, firstName).subscribe((result) => {
      if (result) {
        console.log(result);
        this.showDialog = false;
      }
    });
  }
}

