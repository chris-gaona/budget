import { Component, OnInit, Input } from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  @Input() selectedBudget: Budget;

  @Input() totalSpentActual: number;

  title: string = 'Budget Tracker';

  constructor() { }

  ngOnInit() {
  }

  // isLoggedIn() {
  //   return this.userService.isLoggedIn();
  // }

}
