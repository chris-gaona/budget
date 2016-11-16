import { Component, OnInit, Input } from '@angular/core';
import { Budget } from '../budget';
import { UserService } from '../user.service';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  @Input() selectedBudget: Budget;

  @Input() totalSpentActual: number;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }
}
