import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { UtenteComponent } from './utente/utente.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InformazioniGeneraliComponent } from './informazioni-generali/informazioni-generali.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RicercaComponent } from './ricerca/ricerca.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [HomeComponent, HomeNavComponent, HomeSearchComponent, UtenteComponent, InformazioniGeneraliComponent, RicercaComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
    PaginationModule
  ]
})
export class HomeModule { }
