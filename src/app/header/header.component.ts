import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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

  // decorator for all budgets for select input drop down
  @Input() budgets: Budget[];

  // decorator for selected budget
  @Input() selectedBudget: Budget;

  // decorator for emitting changed selected budget to other components for use
  @Output() chosenBudget: EventEmitter<Budget> = new EventEmitter<Budget>();

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit() {
  }

  createEmptyBudget() {
    let newBudget = new Budget();
    let newDate = new Date();

    // adds new budget with the budgetService
    this.budgetService.addBudget(newBudget);
    // calls convertDate function & passes in new Date()
    this.convertDate(newBudget, newDate);
    // make this new budget the shown one in the modal for editing
    this.shownBudget = newBudget;
  }

  convertDate(budget, date) {
    // converts new date to proper string to be handled by date type input
    return budget.start_period = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  // connection function between header component & this component to create new budget
  // connected through @Output decorator
  createBudget(budget) {
    // converts the date string from 2016-10-30 to 10/30/2016
    let startDate = budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);

    // close the modal window on Let's go button clicked
    this.showDialog = false;
    // sets start_period to newDate
    budget.start_period = newDate;

    if (this.reuseProjection === false) {
      // Handle the event & add change to selected budget
      this.chosenBudget.emit(budget);

    } else {
      this.reuseProjections(budget);
    }

    this.reuseProjection = false;
  }

  // updatedBudget function passes in the $event of the select input binding with (ngModuleChange)
  updateBudget(budget) {
    // using the @Output decorator above, emit the chosen budget to the outside world
    this.chosenBudget.emit(budget);
  }

  cancelBudget() {
    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the newly created last budget item in the array
      if (i === (this.budgets.length - 1)) {
        // remove the budget
        this.budgets.splice(i, 1);
      }
    }
  }

  reuseProjections(budget) {
    let newArray;

    newArray = this.obtainProjection();

    this.budgetService.updateBudgetById(budget.id, {
      budget_items: newArray
    });

    // Handle the event & add change to selected budget
    return this.chosenBudget.emit(budget);
  }

  obtainProjection() {
    let budgetItems;
    let newArray;

    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the budget that was created last week
      if (i === (this.budgets.length - 2)) {
        // assign the last budget to shownBudget variable
        budgetItems = this.budgets[i].budget_items;
      }
    }

    // use a hack to make a deep copy of an array
    newArray = JSON.parse(JSON.stringify(budgetItems));

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].actual = [];
    }

    return newArray;
  }
}
