import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';
import { ConfirmItemComponent } from 'src/app/components/modals/confirm-item/confirm-item.component';
import { ConfirmOrderComponent } from 'src/app/components/modals/confirm-order/confirm-order.component';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/order-item';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-ordine-form',
  templateUrl: './ordine-form.component.html',
  styleUrls: ['./ordine-form.component.scss']
})
export class OrdineFormComponent {
  cards: Card[] = [];
  searchValue!: string;
  selected?: string;
  errorMessage: string = '';

  selectedItems: OrderItem[] = []
  bsModalRef: BsModalRef | undefined;
  bsModalRefItem: BsModalRef | undefined;

  private searchSubject = new Subject<string>();

  constructor(private cardService: CardService, private modalService: BsModalService, private router: Router) {
    this.searchSubject.pipe(
      debounceTime(1000),
      switchMap((term: string) => {
        if (term.length >= 3) {
          return this.cardService.searchAutocomplete(term).pipe(
            catchError(err => {
              this.errorMessage = err.message || 'Something goes wrong';
              return of([]);
            })
          );
        } else {
          return of([]);
        }
      })
    ).subscribe((data: any[]) => {
      this.cards = data;
    });
  }

  loadCards(): void {
    this.searchSubject.next(this.searchValue);
  }


  returnHtml(image: any) {
    return `<span class="btn-block btn-danger well-sm"> <img src="${image.toString()}" alt="avatar" class="img-fluid" style="width: max-content;"></span>`
  }

  addItem(item: Card): void {
    let orderItem: OrderItem = new OrderItem;
    orderItem.card = item
    const initialState = {
      data: orderItem
    };
    this.bsModalRefItem = this.modalService.show(ConfirmItemComponent, { initialState });
    this.bsModalRefItem?.content.event.subscribe((result: any) => {
      this.selectedItems.push(result.data);
    })
  }

  salvaOrdine() {
    let order: Order = new Order()
    order.orderItems = this.selectedItems
    const initialState = {
      data: order
    };
    this.bsModalRef = this.modalService.show(ConfirmOrderComponent, { initialState });
    this.bsModalRef?.content.event.subscribe((result: any) => {
      if(result){
        this.navigate()
      }
      
    })
  }

  navigate() {
    this.router.navigate(['/home/utente/ordini']);
  }

  getPrice(item: any) {
      return item.quantity > 1 ? (item.price / item.quantity) : item.price
  }

  getPriceCM(item: any) {
    return item.quantity > 1 ? (item.priceCM / item.quantity) : item.priceCM
}


  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }
}
