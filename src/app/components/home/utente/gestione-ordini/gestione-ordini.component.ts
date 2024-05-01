import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Observer, Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-gestione-ordini',
  templateUrl: './gestione-ordini.component.html',
  styleUrls: ['./gestione-ordini.component.scss']
})
export class GestioneOrdiniComponent {

  cards: Card[] = [];
  searchValue!: string;
  selected?: string;
  errorMessage: string = '';

  selectedItems: Card[] = []

  private searchSubject = new Subject<string>();

  constructor(private cardService: CardService) {
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
    this.cardService.getPrice(item).subscribe({
      next: (res: any) => {
        item.priceCM = res.price
        this.selectedItems.push(item);
      }
    })
  }


  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }
}
