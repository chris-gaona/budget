import { Component, OnInit, Input } from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  @Input() selectedBudget: Budget;

  @Input() totalSpentActual: any;

  @Input() currentUser: string;

  constructor() { }

  ngOnInit() {
  }

  checkForNumber() {
    return isNaN((this.totalSpentActual.totalSaving / this.selectedBudget.current_income));
  }
}
