import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-card-scan',
  templateUrl: './card-scan.component.html',
  styleUrls: ['./card-scan.component.scss']
})
export class CardScanComponent implements OnInit {
  @ViewChild("videoElement", { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild("canvasElement", { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  model!: tf.GraphModel;
  isDetecting = false;
  FRAME_WIDTH = 500;
  FRAME_HEIGHT = 700;

  logs: any
  constructor() { }

  async ngOnInit() {
    this.addLog("Avvio caricamento del modello...");
    await this.loadModel();
    this.addLog("Modello caricato!");
    this.startCamera();
  }

  // ✅ Funzione per aggiungere log di debug
  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }

  // ✅ Carica il modello TensorFlow.js (JSON)
  async loadModel() {
    console.log("🔄 Caricamento modello TensorFlow.js...");
    this.model = await tf.loadGraphModel('/assets/tfjs_model/model.json'); // Percorso locale
    console.log("✅ Modello TensorFlow.js caricato!");
  }

  // ✅ Avvia la fotocamera
  async startCamera() {
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play().catch(err => this.addLog("Autoplay bloccato: " + err));
        this.detectObjects();
      };
    } catch (error) {
      this.addLog("Errore nell’accesso alla fotocamera: " + error);
    }
  }

  // ✅ Funzione per rilevare oggetti con TensorFlow.js
  async detectObjects() {
    if (!this.model) {
      console.error("❌ Modello non ancora caricato!");
      return;
    }
  
    this.isDetecting = true;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext("2d");
  
    setInterval(async () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
  
      // 🔹 Prepara il frame come input per il modello
      const inputTensor = tf.browser.fromPixels(video)
        .resizeBilinear([640, 640])  // Adatta la dimensione all'input del modello
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));
  
      // 🔍 Esegui inferenza
      const predictions = await this.model.executeAsync(inputTensor) as tf.Tensor[];
      this.addLog("📊 Predictions shape:\n"+ predictions.map(p => p.shape));
      this.addLog("📊 Predictions raw output:\n"+ predictions);

  
      // DEBUG: Mostra la struttura dei tensori
      console.log("Predictions shape:", predictions.map(p => p.shape));
  
      const boxesTensor = predictions[0];  // Bounding boxes
      const scoresTensor = predictions[1]; // Confidence scores
      const classesTensor = predictions[2]; // Classi
  
      // 🔹 Converti i tensori in array corretti
      const boxes = await boxesTensor.array() as number[][]; 
      const scores = await scoresTensor.array() as number[]; 
      const classes = await classesTensor.array() as number[];
  
      // 🔹 Disegna bounding box per ogni oggetto rilevato
      boxes.forEach((box, i) => {
        if (scores[i] > 0.03) {  // Se il punteggio di confidenza è alto
          this.drawBoundingBox(ctx!, {
            bbox: box,
            score: scores[i],
            class: classes[i]
          });
        }
      });
  
      tf.dispose(inputTensor); // Libera memoria
    }, 500);
  }
  

  // ✅ Disegna le bounding box sopra il video
  drawBoundingBox(ctx: CanvasRenderingContext2D, pred: any) {
    const [x, y, width, height] = pred.bbox;
    ctx!.strokeStyle = "red";
    ctx!.lineWidth = 2;
    ctx!.strokeRect(x, y, width, height);
    ctx!.fillStyle = "red";
    ctx!.fillText(`Carta Magic (${(pred.score * 100).toFixed(2)}%)`, x, y - 5);
  }
}
