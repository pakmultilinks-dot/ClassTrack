import * as faceapi from "face-api.js";

let modelLoadPromise = null;

export const loadFaceAPIModels = async () => {
  if (modelLoadPromise) {
    return modelLoadPromise;
  }

  const modelPath = "/models";

  modelLoadPromise = Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
  ]).catch((error) => {
    modelLoadPromise = null;
    throw new Error(
      `Unable to load face-api.js models from ${modelPath}. Add the model files to public/models and try again. ${error.message}`
    );
  });

  return modelLoadPromise;
};

export { faceapi };
