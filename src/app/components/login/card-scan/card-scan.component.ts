import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-card-scan',
  templateUrl: './card-scan.component.html',
  styleUrls: ['./card-scan.component.scss']
})
export class CardScanComponent {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  model: any;

  constructor() {}

  async ngOnInit() {
    await this.loadModel();
    this.startCamera();
  }

  async loadModel() {
    console.log('Loading YOLO model...');
    this.model = await cocoSsd.load(); // Puoi sostituire con un modello YOLO personalizzato
    console.log('Model loaded!');
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
        this.detectObjects();
      })
      .catch((err) => console.error('Error accessing camera:', err));
  }

  async detectObjects() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    setInterval(async () => {
      if (!this.model) return;

      const predictions = await this.model.detect(video);

      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

      predictions.forEach((pred) => {
        if (pred.class === 'card' && pred.score > 0.6) {
          console.log('Carta rilevata:', pred);
          this.callAPI(pred);
        }

        ctx!.strokeStyle = 'red';
        ctx!.lineWidth = 2;
        ctx!.strokeRect(pred.bbox[0], pred.bbox[1], pred.bbox[2], pred.bbox[3]);
        ctx!.fillStyle = 'red';
        ctx!.fillText(pred.class, pred.bbox[0], pred.bbox[1] - 5);
      });
    }, 500);
  }

  callAPI(prediction: any) {
    console.log('Chiamata API con:', prediction);
    // Esegui qui una chiamata HTTP alla tua API con l'immagine o i dettagli della carta rilevata.
  }
}
