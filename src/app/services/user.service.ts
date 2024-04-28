import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url = environment.api_url + 'user/'

  constructor(private http: HttpClient) { }


  getUserInSession(): Observable<any> {
    return this.http.get<any>(this.api_url + 'userinsession')
  }

  getUserRole(): Observable<any> {
    return this.http.get<any>(this.api_url + 'userRole')
  }

  getCardByUser(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.http.get<any>(this.api_url + 'cards', { params: params })
  }
}
