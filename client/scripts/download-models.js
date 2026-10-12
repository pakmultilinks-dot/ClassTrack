import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_REPO_BASE = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";
const OUT_DIR = path.join(__dirname, "../public/models");

const FILES_TO_DOWNLOAD = [
  "tiny_face_detector_model-shard1",
  "tiny_face_detector_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_recognition_model-weights_manifest.json"
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const downloadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUT_DIR, fileName);
    const url = `${MODELS_REPO_BASE}/${fileName}`;
    const file = fs.createWriteStream(dest);
    
    console.log(`Downloading ${fileName}...`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const run = async () => {
  console.log("Starting model download...");
  try {
    for (const fileName of FILES_TO_DOWNLOAD) {
      await downloadFile(fileName);
    }
    console.log("All models downloaded successfully!");
  } catch (err) {
    console.error("Error downloading models:", err.message);
    process.exit(1);
  }
};

run();
