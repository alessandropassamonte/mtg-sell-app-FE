import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as ort from 'onnxruntime-web';

@Component({
  selector: 'app-card-scan',
  templateUrl: './card-scan.component.html',
  styleUrls: ['./card-scan.component.scss']
})
export class CardScanComponent {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  
  session!: ort.InferenceSession;

  constructor() {}

  async ngOnInit() {
    await this.loadONNXModel();
    this.startCamera();
  }

  async loadONNXModel() {
    console.log('Caricamento modello YOLOv11 ONNX...');
    this.session = await ort.InferenceSession.create('assets/modello.onnx');
    console.log('Modello ONNX caricato con successo!');
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
        this.processVideoFrame();
      })
      .catch((err) => console.error('Errore nell’accesso alla fotocamera:', err));
  }

  async processVideoFrame() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    setInterval(async () => {
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
      const tensor = this.captureFrame(video);
      const results = await this.detectObjects(tensor);

      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

      results.forEach((pred) => {
        if (Number(pred.confidence) > 0.6) {
          this.drawBoundingBox(ctx!, pred);
          this.callAPI(pred);
        }
      });
    }, 500);
  }

  captureFrame(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 640;
    canvas.height = 640;
    ctx.drawImage(video, 0, 0, 640, 640);
    
    const imageData = ctx.getImageData(0, 0, 640, 640);
    const data = new Float32Array(imageData.data.length);

    for (let i = 0; i < imageData.data.length; i++) {
      data[i] = imageData.data[i] / 255.0;
    }

    return new ort.Tensor("float32", data, [1, 3, 640, 640]);
  }

  async detectObjects(inputTensor: ort.Tensor) {
    const feeds = { images: inputTensor };
    const results = await this.session.run(feeds);
    
    const output = results["output"].data;
    let detectedObjects = [];

    for (let i = 0; i < output.length; i += 6) {
      let [x, y, width, height, confidence, classIndex] = output.slice(i, i + 6);
      if (Number(confidence) > 0.6) {
        detectedObjects.push({ x, y, width, height, confidence, classIndex });
      }
    }

    return detectedObjects;
  }

  drawBoundingBox(ctx: CanvasRenderingContext2D, pred: any) {
    ctx!.strokeStyle = 'red';
    ctx!.lineWidth = 2;
    ctx!.strokeRect(pred.x, pred.y, pred.width, pred.height);
    ctx!.fillStyle = 'red';
    ctx!.fillText(`Carta Magic (${pred.confidence.toFixed(2)})`, pred.x, pred.y - 5);
  }

  callAPI(pred: any) {
    console.log('Carta rilevata! Chiamata API:', pred);
    // Qui puoi inviare i dati a un'API
  }

}
