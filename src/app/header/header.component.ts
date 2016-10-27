import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // decorator for all budgets for select input drop down
  @Input() budgets: Budget;

  // decorator for selected budget
  @Input() selectedBudget: Budget;

  // decorator for emitting changed selected budget to other components for use
  @Output() chosenBudget = new EventEmitter<Budget>();

  constructor() {
  }

  ngOnInit() {
  }

  // updatedBudget function passes in the $event of the select input binding with (ngModuleChange)
  updateBudget(budget) {
    // using the @Output decorator above, emit the chosen budget to the outside world
    this.chosenBudget.emit(budget);
  }
}
