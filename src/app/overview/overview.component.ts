import { Component, OnInit, Input } from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @Input() selectedBudget: Budget;

  @Input() totalSpent: number;

  constructor() { }

  ngOnInit() {
  }

}
