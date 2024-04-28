import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url

  getAllCardPaginated(page: number, size: number): Observable<Card> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.api_url + 'card/all', { params: params })
  }


  search(page: number, size: number, searchForm: any): Observable<Card> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('search', searchForm.search.toString());
    return this.http.get<any>(this.api_url + 'card/search', { params: params })
  }
}
