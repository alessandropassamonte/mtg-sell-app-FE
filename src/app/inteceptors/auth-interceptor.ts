import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, switchMap, tap, throwError } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private routers: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    if (authToken) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`,
          'rejectUnauthorized': 'false'
        }
      });
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && localStorage.getItem('refresh_token')) {
          // L'access_token è scaduto o non valido
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      catchError((error: any) => {
        this.authService.logout(); // Effettua il logout dell'utente
        return throwError(() => error);
      }),
      switchMap(() => {
        // Riprova la richiesta originale con il nuovo access_token
        if (localStorage.getItem('keep_connection') && localStorage.getItem('refresh_token')) {
          request = this.addAuthorizationHeader(request);
          return next.handle(request);
        } else {
          this.authService.logout(); // Effettua il logout dell'utente
          return throwError(() => {
            new Error('Effettuare Login')
          });
        }

      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.authService.getToken();
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return request;
  }

}
