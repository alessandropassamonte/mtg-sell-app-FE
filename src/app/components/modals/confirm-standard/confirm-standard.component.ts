import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-standard',
  templateUrl: './confirm-standard.component.html',
  styleUrls: ['./confirm-standard.component.scss']
})
export class ConfirmStandardComponent {

  @Output() event: EventEmitter<any> = new EventEmitter();


  constructor(public bsModalRef: BsModalRef){}
  confirm(): void {
    this.event.emit({data: true});
    this.bsModalRef?.hide();
  }

  decline(): void {
    this.event.emit({data: false});
    this.bsModalRef?.hide();
  }
}
