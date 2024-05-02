import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Route, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable, Observer, Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { CardService } from 'src/app/services/card.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-gestione-ordini',
  templateUrl: './gestione-ordini.component.html',
  styleUrls: ['./gestione-ordini.component.scss']
})
export class GestioneOrdiniComponent implements OnInit {
  currentPage = 0;
  itemsPerPage = 12;
  totalItems!: any

  orders!: Order[]; 
  constructor(private orderService: OrderService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders() {
    this.orderService.getOrdersByUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.orders = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  navigate(order?: Order) {

    console.log('ORDER ', order)
    if(order){
      const navigationExtras: NavigationExtras = {
        state: {
          orderItems: order.orderItems,
          readOnly: true 
        }
      }
      this.router.navigate(['/home/utente/ordini/form'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        state: {
          orderItems: [],
          readOnly: false
        }
      }
      this.router.navigate(['/home/utente/ordini/form'], navigationExtras);
    }
    
  }

  pageChanged(event: PageChangedEvent): void {
      this.orderService.getOrdersByUser((event.page - 1), event.itemsPerPage).subscribe({
        next: (res: any) => {
          this.orders = res.content
          this.orders.map(item => ({
            ...item,
            orderDate: this.datePipe.transform(item.orderDate, 'dd/MM/yyyy')
          }))
          this.totalItems = res.totalElements
        }
      })
  }

  getDate(date: any){
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm')
  }
  
}
