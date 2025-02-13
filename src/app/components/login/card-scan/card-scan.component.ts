import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
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
  isProcessing = false;
  logs: string[] = []; // ✅ Variabile per i log visibili in pagina
  detectedCards: any;

  // 📌 Dimensioni per aspect ratio 5:7
  FRAME_WIDTH = 500;
  FRAME_HEIGHT = 700;

  constructor(private platform: Platform) { }

  async ngOnInit() {

    // this.addLog("Inizializzazione dell'app...");

    try {
      // this.addLog("Caricamento modello ONNX...");
      await this.loadONNXModel();
      // this.addLog("Modello ONNX caricato!");
    } catch (error) {
      this.addLog("Errore nel caricamento del modello ONNX: " + error);
    }

    if (this.platform.is('android')) {
      // this.addLog("Verifica permessi fotocamera...");
      await this.requestCameraPermission();
    }

    this.addLog("Avvio fotocamera...");
    this.startCamera();


  }

  // ✅ Funzione per aggiungere log in pagina
  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift(`[${timestamp}] ${message}`);
    console.log(message);
  }

  // ✅ Richiede i permessi per la fotocamera su Android 14+
  async requestCameraPermission() {

    if (Capacitor.isNativePlatform()) {
      const status = await Camera.checkPermissions();

      if (status.camera !== 'granted') {

        const requestStatus = await Camera.requestPermissions({ permissions: ['camera'] });
        if (requestStatus.camera !== 'granted') {
          this.addLog("Permessi fotocamera negati! Attivali manualmente nelle impostazioni.");
          return;
        }
      }
    }

    // this.addLog("Permessi fotocamera concessi!");
    this.startCamera();
  }

  // ✅ Carica il modello YOLOv11 ONNX
  async loadONNXModel() {
    this.addLog("Caricamento modello YOLOv11 ONNX...");

    try {
      ort.env.wasm.wasmPaths = 'assets/onnxruntime/';
      ort.env.wasm.numThreads = 1;

      this.session = await ort.InferenceSession.create('assets/modello.onnx');

      // ✅ Stampiamo gli input e output disponibili
      this.addLog("Input del modello: " + JSON.stringify(this.session.inputNames));
      this.addLog("Output del modello: " + JSON.stringify(this.session.outputNames));

      // this.addLog("Modello YOLO ONNX caricato con successo!");
    } catch (error) {
      this.addLog("Errore nel caricamento del modello ONNX: " + error);
    }
  }



  // ✅ Avvia la fotocamera e gestisce l'autoplay
  async startCamera() {
    // this.addLog("Avvio della fotocamera...");

    try {
      const constraints = { video: { facingMode: 'environment', width: 640, height: 640 } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // this.addLog("Stream fotocamera ottenuto!");

      const video = this.videoElement.nativeElement;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        // this.addLog("Fotocamera pronta, avvio video...");
        video.play().catch(err => this.addLog("Autoplay bloccato: " + err));
        this.processVideoFrame();
      };

    } catch (error) {
      this.addLog("Errore nell’accesso alla fotocamera: " + error);
    }
  }

  // ✅ Acquisisce i frame e li invia a YOLOv11 ONNX
  async processVideoFrame() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const processFrame = async () => {
      if (!this.session) return;

      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

      const tensor = this.captureFrame(video);
      // this.addLog("Frame convertito in tensor ONNX.");

      const results = await this.detectObjects(tensor);
      // this.addLog("Rilevamento completato. Oggetti trovati: " + results.length);

      // results.forEach((pred) => {
      //   if (Number(pred.confidence) > 0.6) {
      //     this.drawBoundingBox(ctx!, pred, canvas.width / this.FRAME_WIDTH, canvas.height / this.FRAME_HEIGHT);
      //     this.detectedCards.push(this.cropCard(video, pred));
      //   }
      // });

      requestAnimationFrame(processFrame); // ✅ Continua a processare in tempo reale
    };

    requestAnimationFrame(processFrame);
  }


  cropCard(video: HTMLVideoElement, pred: any): string {
    const canvas = document.createElement("canvas");
    const scaleX = video.videoWidth / this.FRAME_WIDTH;
    const scaleY = video.videoHeight / this.FRAME_HEIGHT;

    canvas.width = pred.width * scaleX;
    canvas.height = pred.height * scaleY;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      video,
      pred.x * scaleX, pred.y * scaleY,
      pred.width * scaleX, pred.height * scaleY,
      0, 0,
      canvas.width, canvas.height
    );

    return canvas.toDataURL("image/png");
  }


  // ✅ Converte i frame in tensor ONNX mantenendo aspect ratio 5:7
  captureFrame(video: HTMLVideoElement) {
    const INPUT_SIZE = 640;  // ✅ Dimensione fissa per YOLO (puoi provare con 416 se non funziona)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = INPUT_SIZE;
    canvas.height = INPUT_SIZE;
    ctx.drawImage(video, 0, 0, INPUT_SIZE, INPUT_SIZE);
    const imageData = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
    const data = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
    for (let i = 0; i < INPUT_SIZE * INPUT_SIZE; i++) {
      data[i * 3 + 0] = imageData.data[i * 4 + 0] / 255.0;
      data[i * 3 + 1] = imageData.data[i * 4 + 1] / 255.0;
      data[i * 3 + 2] = imageData.data[i * 4 + 2] / 255.0;
    }

    return new ort.Tensor("float32", data, [1, 3, INPUT_SIZE, INPUT_SIZE]);
  }


  
   sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x)); // ✅ Converte logit in probabilità tra 0 e 1
  }
  
  async detectObjects(inputTensor: ort.Tensor) {
    this.addLog("🔍 Avvio rilevamento YOLO ONNX...");
  
    try {
      const feeds = { images: inputTensor };
      this.addLog("📡 Esecuzione `session.run()`...");
      const results = await this.session.run(feeds);
      this.addLog("✅ Rilevamento completato!");
  
      if (!results["output0"]) {
        this.addLog("❌ Errore: YOLO non ha restituito alcun output.");
        return [];
      }
  
      const output = results["output0"].data;
      this.addLog(`📊 YOLO Output ricevuto. Lunghezza: ${output.length}`);
  
      // 📌 Stampiamo i primi 100 valori grezzi dell'output per capire la struttura
      const rawOutputSnippet = Array.from(output as Float32Array).slice(0, 100).map(v => v.toFixed(2)).join(", ");

      // const rawOutputSnippet = Array.from(output).slice(0, 100).map(v => v.toFixed(2)).join(", ");
      this.addLog(`🔍 Primi 100 valori grezzi: ${rawOutputSnippet}`);
  
      let detectedObjects = [];
      const NUM_BBOX = output.length / 6; // Ogni bounding box ha 6 valori
      const MAX_LOGS = 10; // Limitiamo i log
  
      for (let i = 0; i < NUM_BBOX * 6; i += 6) {
        let x = Number(output[i]);
        let y = Number(output[i + 1]);
        let width = Number(output[i + 2]);
        let height = Number(output[i + 3]);
        let objectness = Number(output[i + 4]);  // 📌 Questo dovrebbe essere la confidenza
        let classScore = Number(output[i + 5]);  // 📌 Questo dovrebbe essere la confidenza della classe
        let classIndex = 0; // Hai solo una classe, quindi è sempre "0"
  
        let confidence = Math.min(objectness, classScore);
  
        if (detectedObjects.length < MAX_LOGS) {
          this.addLog(`🔎 X=${x.toFixed(2)}, Y=${y.toFixed(2)}, W=${width.toFixed(2)}, H=${height.toFixed(2)}, Objectness=${objectness.toFixed(2)}, ClassScore=${classScore.toFixed(2)}, Conf=${confidence.toFixed(2)}`);
        }
  
        if (confidence > 0.3) {  
          detectedObjects.push({ x, y, width, height, confidence, classIndex });
  
          if (detectedObjects.length <= MAX_LOGS) {
            this.addLog(`🔲 Rilevato: X=${x.toFixed(2)}, Y=${y.toFixed(2)}, W=${width.toFixed(2)}, H=${height.toFixed(2)}, Conf=${confidence.toFixed(2)}, Class=${classIndex}`);
          }
        }
      }
  
      this.addLog(`✅ Oggetti finali rilevati: ${detectedObjects.length}`);
      return detectedObjects;
    } catch (error) {
      this.addLog("🔥 ERRORE in YOLO ONNX: " + JSON.stringify(error));
      return [];
    }
  }
  
  
  
  
  
  
  
  
  






  // ✅ Disegna la bounding box attorno alla carta Magic riconosciuta
  drawBoundingBox(ctx: CanvasRenderingContext2D, pred: any, scaleX: number, scaleY: number) {
    const x = pred.x * scaleX;
    const y = pred.y * scaleY;
    const width = pred.width * scaleX;
    const height = pred.height * scaleY;

    ctx!.strokeStyle = 'red';
    ctx!.lineWidth = 2;
    ctx!.strokeRect(x, y, width, height);

    ctx!.fillStyle = 'red';
    ctx!.fillText(`Carta Magic (${pred.confidence.toFixed(2)})`, x, y - 5);
  }

  callAPI(test: any) {

  }
}
