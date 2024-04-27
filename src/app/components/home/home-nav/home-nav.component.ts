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

  
  data: any;
  cards!: any[];
  totalItems= 0;

  currentPage = 0;
  itemsPerPage = 12;


  constructor(private cardService: CardService, private cdr: ChangeDetectorRef){

    
  }

  ngOnInit(): void {
    this.getAllCards()
  }



  getAllCards() {
    this.cardService.getAllCardPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.data = res
        this.cards = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  pageChanged(event: PageChangedEvent): void {
    this.cardService.getAllCardPaginated((event.page - 1), event.itemsPerPage).subscribe({
      next: (res: any) => {
        this.data = res
        this.cards = res.content
        this.totalItems = res.totalElements
      }
    })
  }

}
