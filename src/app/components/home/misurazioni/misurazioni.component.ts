import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-misurazioni',
  templateUrl: './misurazioni.component.html',
  styleUrls: ['./misurazioni.component.scss']
})
export class MisurazioniComponent implements OnInit {

  @Input()
  risultatiMisurazioni: any[] | undefined;

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

}
