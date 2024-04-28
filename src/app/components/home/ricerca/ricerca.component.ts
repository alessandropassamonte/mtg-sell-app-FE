import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RicercaService } from 'src/app/services/ricerca.service';
import { TipologicheService } from 'src/app/services/tipologiche.service';
import { UserService } from 'src/app/services/user.service';
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

  workerOptions: string[] = [];
  bodyRegionOptions: string[] = ['Testa', 'Viso', 'Schiena', 'Petto', 'Braccia', 'Piedi'];
  jobCategoryOptions: string[] = [];
  environmentOptions: string[] = [];

  risultatiMisurazioni: any[] = []

  distanze: number[] = [5, 10, 20, 30, 50, 100];

  configDate = {
    // containerClass: 'theme-dark',
    rangeInputFormat: 'DD/MM/YYYY',
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    showTodayButton: false,
    todayPosition: 'center',
    isAnimated: true
  };

  map: any;
  latitude: number = 42;
  longitude: number = 13;


  constructor(private formBuilder: FormBuilder,
    private localeService: BsLocaleService, private cardService: CardService) {
    this.localeService.use('it');


  }


  user: User | null | undefined;
  subscription = new Subscription();


  workerList: any[] = []



  ngOnInit() {
    this.createForm()
    this.getAllCards()
   
  }

  data: any;
  cards!: Card[];
  totalItems= 0;

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
    if(this.searchForm.get('search')){
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
