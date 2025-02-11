import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-card-model',
  templateUrl: './card-model.component.html',
  styleUrls: ['./card-model.component.css']
})
export class CardModelComponent implements OnInit {
  model: any;
  predictions: any[] = [];

  constructor() { }

  async ngOnInit() {
    await this.loadModel();
  }

  async loadModel() {
    // Carica un modello pre-addestrato. Qui usiamo MobileNet come esempio, ma puoi caricare il tuo modello.
    this.model = await mobilenet.load();
    console.log('Modello caricato!');
  }

  async predict(imageElement: HTMLImageElement) {
    if (this.model) {
      // Predici usando l'immagine fornita. Qui usiamo MobileNet, ma adatta per il tuo modello
      const predictions = await this.model.classify(imageElement);
      this.predictions = predictions;
      console.log('Predizioni:', predictions);
    } else {
      console.error('Modello non ancora caricato');
    }
  }
}