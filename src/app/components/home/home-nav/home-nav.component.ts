import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CardService } from 'src/app/services/card.service';
import { FileService } from 'src/app/services/file.service';
import { environment } from 'src/envioronment/environment';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {

  
 

  constructor(private cardService: CardService, private cdr: ChangeDetectorRef){

    
  }

  ngOnInit(): void {
  }



  

}
