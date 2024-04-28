import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { UtenteComponent } from './utente/utente.component';
import { InformazioniGeneraliComponent } from './informazioni-generali/informazioni-generali.component';
import { RicercaComponent } from './ricerca/ricerca.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dettaglio', component: InformazioniGeneraliComponent},
  {path: 'utente', component: UtenteComponent},
  {path: 'ricerca', component: RicercaComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
