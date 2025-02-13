import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("best_3.onnx")
input_data = np.random.rand(1, 3, 640, 640).astype(np.float32)  # Simula un'immagine

outputs = session.run(None, {"images": input_data})
print("📊 Primi 20 valori post-export:", outputs[0].flatten()[:20])