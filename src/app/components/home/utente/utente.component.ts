import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';
import { faEdit, faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { Card } from 'src/app/models/card';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';



@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent implements OnInit {

  currentPage = 0;
  itemsPerPage = 12;
  totalItems!: any

  cards!: Card[]; 
  constructor(private authService: AuthService, private router: Router, private userService: UserService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.userService.getCardByUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.cards = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  navigate(input: string) {
    this.router.navigate([input])
  }

  pageChanged(event: PageChangedEvent): void {
    
      this.userService.getCardByUser((event.page - 1), event.itemsPerPage).subscribe({
        next: (res: any) => {
          this.cards = res.content
          this.totalItems = res.totalElements
        }
      })
    

  }
}
