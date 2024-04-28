import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CardService } from 'src/app/services/card.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent implements OnInit {

  searchForm!: FormGroup



  constructor(private formBuilder: FormBuilder,
    private localeService: BsLocaleService, private cardService: CardService) {
    this.localeService.use('it');
  }

  ngOnInit() {
    this.createForm()
    this.getAllCards()
  }

  data: any;
  cards!: Card[];
  totalItems = 0;

  currentPage = 0;
  itemsPerPage = 12;


  createForm() {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]

    });
  }


  search() {
    this.cardService.search(0, this.itemsPerPage, this.searchForm.value).subscribe({
      next: (res: any) => {
        this.data = res
        this.cards = res.content
        this.totalItems = res.totalElements
      }
    })
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
    if (this.searchForm.get('search')) {
      this.cardService.search((event.page - 1), event.itemsPerPage, this.searchForm.value).subscribe({
        next: (res: any) => {
          this.data = res
          this.cards = res.content
          this.totalItems = res.totalElements
        }
      })
    } else {
      this.cardService.getAllCardPaginated((event.page - 1), event.itemsPerPage).subscribe({
        next: (res: any) => {
          this.data = res
          this.cards = res.content
          this.totalItems = res.totalElements
        }
      })
    }

  }
}
