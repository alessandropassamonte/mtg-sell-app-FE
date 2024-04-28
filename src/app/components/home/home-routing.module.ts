import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { UtenteComponent } from './utente/utente.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { DettaglioComponent } from './dettaglio/dettaglio.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'utente', component: UtenteComponent},
  {path: 'ricerca', component: RicercaComponent},
  { path: 'dettaglio/:id', component: DettaglioComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
