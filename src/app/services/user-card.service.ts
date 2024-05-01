import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
import { UserCard } from '../models/user-card';

@Injectable({
  providedIn: 'root'
})
export class UserCardService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'usercard/'

  getCardByUser(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.http.get<any>(this.api_url + 'cards', { params: params })
  }

  addCardToUser(cardsId: number[]): Observable<any> {
    let cardAddUserRequest = {
      cardsId: cardsId
    }
    return this.http.post<any>(this.api_url + 'addCards', cardAddUserRequest)
  }

  update(userCard: UserCard){
    return this.http.post<any>(this.api_url + 'update', userCard)
  }
}
