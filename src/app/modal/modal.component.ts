import { Component, OnInit, Input, Output, EventEmitter,
  trigger, style, animate, transition } from '@angular/core';
import { Budget } from '../budget';
import { BudgetService } from '../budget.service';

// Thank you https://coryrylan.com/blog/build-a-angular-modal-dialog-with-angular-animate

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    // The first line we have a trigger value: dialog. This is the value that matches the [@dialog] property in our template
    trigger('dialog', [
      // * wildcard syntax which means in any state change of the applied element it should trigger the animation
      // void => * applies the first animation when the element enters the view or is not "void" of the view
      transition('void => *', [
        style({ transform: 'translateY(-1000px)' }),
        animate(300)
      ]),
      // second transition is very similar but uses * => void to apply the second animation
      // when the element leaves the view or is “void” of the view
      transition('* => void', [
        animate(200, style({ transform: 'translateY(1000px)' }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  // decorator for all budgets for select input drop down
  @Input() budgets: Budget[];

  @Input() visible: boolean;

  @Input() editing: boolean;

  @Input() showDelete: boolean;

  @Input() budget: Budget;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() editingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() showDeleteChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() budgetChange: EventEmitter<Budget> = new EventEmitter<Budget>();

  constructor(private budgetService: BudgetService) { }

  ngOnInit() {
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);

    if (this.editing === true) {
      this.editing = false;
      this.editingChange.emit(this.editing);
      this.showDelete = false;
      this.showDeleteChange.emit(this.showDelete);
    }
  }

  reverseDate() {
    let startDate = this.budget.start_period.split('-');
    let newDateString = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    let newDate = new Date(newDateString);

    this.budget.start_period = newDate;

    this.budgetChange.emit(this.budget);
  }

  cancelBudget() {
    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the newly created last budget item in the array
      if (i === (this.budgets.length - 1)) {
        // assign the last budget to shownBudget variable
        this.deleteBudget(this.budgets[i]);
      }
    }
  }

  deleteBudget(budget) {
    this.budgetService.deleteBudgetById(budget._id)
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });

    let newIndex;

    // loop through each budget item
    for (let i = 0; i < this.budgets.length; i++) {
      // find the newly created last budget item in the array
      if (this.budgets[i]._id === budget._id) {
        // remove the budget
        this.budgets.splice(i, 1);
        newIndex = i - 1;
      }
    }

    this.budgetChange.emit(this.budgets[newIndex]);
  }
}
