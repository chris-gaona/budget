import { Component } from '@angular/core';
import { BudgetService } from './budget.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ BudgetService ]
})
export class AppComponent {

  constructor(private budgetService: BudgetService) { }

  get budgets() {
    return this.budgetService.getAllBudgets();
  }
}
