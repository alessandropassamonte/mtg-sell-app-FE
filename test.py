import onnx
import os
import subprocess
import onnx2tf
import tensorflowjs as tfjs

# 📌 1️⃣ Percorsi dei modelli
ONNX_MODEL_PATH = "best_3.onnx"     # Inserisci il tuo file ONNX
TF_SAVED_MODEL_DIR = "saved_model"   # Cartella output per TensorFlow SavedModel
TFJS_MODEL_DIR = "tfjs_model"        # Cartella output per TensorFlow.js

# 📌 2️⃣ Controlla se il file ONNX esiste
if not os.path.exists(ONNX_MODEL_PATH):
    raise FileNotFoundError(f"❌ Il modello '{ONNX_MODEL_PATH}' non esiste!")

print("🔄 Conversione ONNX → TensorFlow SavedModel con output signaturedefs...")

# 📌 3️⃣ Converte ONNX in TensorFlow SavedModel con opzione `--output_signaturedefs`
onnx2tf.convert(
    input_onnx_file_path=ONNX_MODEL_PATH,
    output_folder_path=TF_SAVED_MODEL_DIR,
    output_signaturedefs=True  # ✅ RISOLVE IL PROBLEMA DI NOMI NON VALIDI
)

print(f"✅ Modello convertito in TensorFlow SavedModel salvato in '{TF_SAVED_MODEL_DIR}'")

# 📌 4️⃣ Converti il modello SavedModel in TensorFlow.js
print("🔄 Conversione in TensorFlow.js...")
os.makedirs(TFJS_MODEL_DIR, exist_ok=True)

tfjs.converters.convert_tf_saved_model(TF_SAVED_MODEL_DIR, TFJS_MODEL_DIR)

print(f"✅ Conversione completata! Modello TensorFlow.js salvato in '{TFJS_MODEL_DIR}'")
