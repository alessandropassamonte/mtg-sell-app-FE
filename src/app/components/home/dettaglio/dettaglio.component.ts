import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss']
})
export class DettaglioComponent {
  constructor(private route: ActivatedRoute, private cardService: CardService) {}


  id!: any;
  card!: Card
  ngOnInit() {
      this.route.params.subscribe(params => {
          this.id = params['id']; 
          this.findByCardId(params['id'])
      });
      
  }


  findByCardId(cardId: any){
    this.cardService.findByCardId(cardId).subscribe({
      next: (res: any) => {
        this.card = res
      }
    })
  }
}
