import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { LavoroComponent } from './lavoro/lavoro.component';
import { UtenteComponent } from './utente/utente.component';
import { AccessoriComponent } from './accessori/accessori.component';
import { MisuraComponent } from './misura/misura.component';
import { DispositivoComponent } from './dispositivo/dispositivo.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InformazioniGeneraliComponent } from './informazioni-generali/informazioni-generali.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnamnesiComponent } from './anamnesi/anamnesi.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RicercaComponent } from './ricerca/ricerca.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MisurazioniComponent } from './misurazioni/misurazioni.component';

@NgModule({
  declarations: [HomeComponent, HomeNavComponent, HomeSearchComponent, LavoroComponent, UtenteComponent, AccessoriComponent, MisuraComponent, DispositivoComponent, InformazioniGeneraliComponent, AnamnesiComponent, RicercaComponent, MisurazioniComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
  ]
})
export class HomeModule { }
