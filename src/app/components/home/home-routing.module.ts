import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AccessoriComponent } from './accessori/accessori.component';
import { LavoroComponent } from './lavoro/lavoro.component';
import { MisuraComponent } from './misura/misura.component';
import { UtenteComponent } from './utente/utente.component';
import { DispositivoComponent } from './dispositivo/dispositivo.component';
import { InformazioniGeneraliComponent } from './informazioni-generali/informazioni-generali.component';
import { AnamnesiComponent } from './anamnesi/anamnesi.component';
import { RicercaComponent } from './ricerca/ricerca.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'informazioni-generali', component: InformazioniGeneraliComponent},
  {path: 'anamnesi', component: AnamnesiComponent},
  {path: 'accessori', component: AccessoriComponent},
  {path: 'dispositivo', component: DispositivoComponent},
  {path: 'lavoro', component: LavoroComponent},
  {path: 'misura', component: MisuraComponent},
  {path: 'utente', component: UtenteComponent},
  {path: 'ricerca', component: RicercaComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
