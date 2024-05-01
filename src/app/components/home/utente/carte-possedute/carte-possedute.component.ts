import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Card } from 'src/app/models/card';
import { UserCard } from 'src/app/models/user-card';
import { AuthService } from 'src/app/services/auth.service';
import { UserCardService } from 'src/app/services/user-card.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carte-possedute',
  templateUrl: './carte-possedute.component.html',
  styleUrls: ['./carte-possedute.component.scss']
})
export class CartePosseduteComponent implements OnInit {

  currentPage = 0;
  itemsPerPage = 12;
  totalItems!: any

  userCards!: UserCard[]; 

  constructor(private authService: AuthService, private router: Router, private userCardService: UserCardService, private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.userCardService.getCardByUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.userCards = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  navigate(input: string) {
    this.router.navigate([input])
  }

  pageChanged(event: PageChangedEvent): void {
    
      this.userCardService.getCardByUser((event.page - 1), event.itemsPerPage).subscribe({
        next: (res: any) => {
          this.userCards = res.content
          this.totalItems = res.totalElements
        }
      })
  }

  changeInVendita(item: UserCard){
    item.inVendita = !(item.inVendita)

    this.userCardService.update(item).subscribe({
      next: (resUpdate: any) => {
        this.userCardService.getCardByUser(this.currentPage, this.itemsPerPage).subscribe({
          next: (res: any) => {
            this.userCards = res.content
            this.totalItems = res.totalElements
          }
        })
      }
      
    })
  }
  

}
