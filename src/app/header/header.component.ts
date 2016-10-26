import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() budgets: Budget;

  @Input() selectedBudget: Budget;

  @Output() chosenBudget = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  updateBudget(budget) {
    this.selectedBudget = budget;
    this.chosenBudget.emit(budget);
  }
}
