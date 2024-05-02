import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Card } from 'src/app/models/card';
import { UserCard } from 'src/app/models/user-card';
import { UserCardService } from 'src/app/services/user-card.service';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  title?: string;
  closeBtnName?: string;
  cardsId: any[] = [];

  confirmForm!: FormGroup


  @Output() event: EventEmitter<any> = new EventEmitter();


  @Input() data!: Card;
 
  constructor(public bsModalRef: BsModalRef, private userCardService: UserCardService, private fb: FormBuilder, private toast: ToastrService) {
    this.confirmForm = this.fb.group({
      attivo: [true, [Validators.required]],
      foil: [false, [Validators.required]],
      inVendita: [false, [Validators.required]],
    })
  }
 
  ngOnInit() {
  }

  confirm(): void {
    this.aggiungiCarta();
    
  }
 
  decline(): void {
    this.bsModalRef?.hide();
  }

  aggiungiCarta(){
    let userCard: UserCard = this.buildUSerCard(this.data)
    this.userCardService.addCardToUser(userCard).subscribe({
      next: (res: any) => {
        this.event.emit({data: {message: 'Inserito con successo'}});
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.success('Carta aggiunta con successo')
      },
      error: (error) => {
        this.event.emit({data: {message: 'Errore'}});
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.warning('Errore durante l\'inserimento')
      }
    })
  }

  buildUSerCard(card: Card): UserCard{
    let userCard: UserCard = new UserCard();
    userCard.card = card
    userCard.foil = this.confirmForm.get('foil')?.value
    userCard.inVendita = this.confirmForm.get('inVendita')?.value
    userCard.attivo = this.confirmForm.get('attivo')?.value

    return userCard;
  }
}
