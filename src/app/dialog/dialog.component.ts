import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input()
  public secretWord = '';

  @Input()
  public wordGuessCorrect = false;

  @Input()
  public category = '';

  @Output()
  public closed: EventEmitter<any> = new EventEmitter();

  public closeDialog(): void {
    this.closed.emit();
  }
}
