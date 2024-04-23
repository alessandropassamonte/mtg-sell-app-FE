import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeIta from '@angular/common/locales/it';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { itLocale } from 'ngx-bootstrap/locale';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerConfig, TimepickerModule } from 'ngx-bootstrap/timepicker';
import { LoadingInterceptor } from './inteceptors/loading-interceptor';
import { ErrorInterceptor } from './inteceptors/error-interceptor';
import { AuthInterceptor } from './inteceptors/auth-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from 'ngx-spinner';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('token'),
    allowedDomains: [],
    disallowedRoutes: ['example.com/login'],
  };
}

defineLocale('it', itLocale);
registerLocaleData(localeIta);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,

  ],
  imports: [
    BsDatepickerModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    })
    

  ],
  providers: [
    BsDatepickerConfig, DatePipe, TimepickerConfig, FormBuilder, JwtHelperService,
    { provide: LOCALE_ID, useValue: "it-IT" },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
