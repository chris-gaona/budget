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

  constructor(private budgetService: BudgetService) { }

  get budgets() {
    return this.budgetService.getAllBudgets();
  }

  ngOnInit() {
    this.selectedBudget = this.budgetService.getAllBudgets()[0];
  }
}
