import {Component, OnInit, Input} from '@angular/core';
import { Budget } from '../budget';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  @Input() selectedBudget: Budget;

  @Input() totalSpentActual: number;

  @Input() totalSpentProjection: number;

  constructor() { }

  ngOnInit() {
  }

}
