import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CardService } from 'src/app/services/card.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Card } from 'src/app/models/card';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent implements OnInit {

  searchForm!: FormGroup

  initializedFromQueryParams: boolean = false;

  cardsId: number[] = []
  constructor(private formBuilder: FormBuilder,
    private localeService: BsLocaleService, private cardService: CardService, private router: Router, private userService: UserService, private route: ActivatedRoute) {
    this.localeService.use('it');

    this.searchForm = this.formBuilder.group({
      search: [null, Validators.required]
    });
    
    if(this.route.snapshot.queryParams['search']){
      this.searchForm.patchValue({
        search: this.route.snapshot.queryParams['search']
      })
      this.currentPage = this.route.snapshot.queryParams['page'];
      this.initializedFromQueryParams = true;
      this.search( this.route.snapshot.queryParams['page'] < 0 ? 0 : (this.route.snapshot.queryParams['page'] - 1) , 12)
    }

  }

  ngOnInit() {
  }

  data: any;
  cards!: Card[];
  totalItems = 0;

  currentPage = 0;
  itemsPerPage = 12;



  search(page: any, itemsPerPage: any) {
    const searchTerm = this.searchForm.get('search')?.value;
    if(searchTerm){
      this.cardService.search(page, itemsPerPage, searchTerm).subscribe({
        next: (res: any) => {
          this.data = res
          this.cards = res.content
          this.totalItems = res.totalElements
        }
      })
    }
    
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
    if (this.searchForm.get('search')  && !this.initializedFromQueryParams) {
      this.currentPage = (event.page - 1)
      this.itemsPerPage = event.itemsPerPage
      this.cardService.search((event.page - 1), event.itemsPerPage, this.searchForm.value).subscribe({
        next: (res: any) => {
          this.data = res
          this.cards = res.content
          this.totalItems = res.totalElements
        }
      })
    } 
    this.initializedFromQueryParams = false;
  }

  navigate(id: any, page: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { search: this.searchForm.get('search')?.value , page: page, itemsPerPage: this.itemsPerPage }
    };
    this.router.navigate(['/home/dettaglio', id], navigationExtras);
  }

  aggiungiCarta(id: any){
    this.cardsId.push(id)
    this.userService.addCardToUser(this.cardsId).subscribe({
      next: (res: any) => {
        this.cardsId = []
      },
      error: (error) => {
        this.cardsId = []
      }
    })
  }
}
