import { Component, OnInit, Input, Output, OnChanges, EventEmitter,
  trigger, state, style, animate, transition } from '@angular/core';

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
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(200)
      ]),
      // second transition is very similar but uses * => void to apply the second animation when the element leaves the view or is “void” of the view
      transition('* => void', [
        animate(200, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  @Input() closable = true;

  @Input() visible: boolean;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
