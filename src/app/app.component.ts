import { Component, OnInit } from '@angular/core';
import { BudgetService } from './budget.service';
import { Budget } from './budget';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ BudgetService ]
})
export class AppComponent implements OnInit {
  selectedBudget: Budget;
  totalActual: number;
  totalSpent: number;
  totals: any;
  mergeTotals: number;

  constructor(private budgetService: BudgetService) { }

  get budgets() {
    return this.budgetService.getAllBudgets();
  }

  ngOnInit() {
    this.selectedBudget = this.budgetService.getAllBudgets()[0];
  }

  chosenBudget(budget) {
    // Handle the event
    this.selectedBudget = budget;
  }

  getActualTotal(budget) {
    this.totalActual = 0;
    for (let i = 0; i < budget.actual.length; i++) {
      this.totalActual += budget.actual[i].amount;
    }
    return this.totalActual;
  }

  getTotalSpent() {
    this.totalSpent = 0;
    this.totals = [];
    this.mergeTotals = 0;
    for (let i = 0; i < this.selectedBudget.budget_items.length; i++) {
      let item = this.selectedBudget.budget_items[i];
      for (let j = 0; j < item.actual.length; j++) {
        this.totalSpent += item.actual[j].amount;
      }
    }
    this.totals.push(this.totalSpent);

    for (let i = 0; i < this.totals.length; i++) {
      this.mergeTotals += this.totals[i];
    }

    return this.mergeTotals;
  }
}

