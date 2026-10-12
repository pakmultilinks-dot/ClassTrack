import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCamera, FiLoader, FiPower, FiVideo, FiVideoOff } from "react-icons/fi";
import { faceapi, loadFaceAPIModels } from "../../utils/loadFaceModels";
import FacePreviewCard from "./FacePreviewCard";

const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 224,
  scoreThreshold: 0.5
});

const WebcamScanner = ({
  busy = false,
  captureButtonLabel = "Capture Face",
  captureLoadingLabel = "Capturing...",
  disabled = false,
  idleDescription = "Open the webcam to load face detection and capture a real face descriptor.",
  idleTitle = "Webcam closed",
  onDescriptorGenerated,
  openButtonLabel = "Open Webcam",
  registrationMessage,
  stopButtonLabel = "Close Webcam"
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionTimerRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [descriptor, setDescriptor] = useState(null);
  const [detectionStatus, setDetectionStatus] = useState("idle");

  const isCaptureReady = useMemo(() => {
    return cameraActive && modelsReady && faceCount === 1 && !capturing && !busy && !disabled;
  }, [cameraActive, modelsReady, faceCount, capturing, busy, disabled]);

  const stopCamera = () => {
    if (detectionTimerRef.current) {
      clearInterval(detectionTimerRef.current);
      detectionTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setFaceCount(0);
    setDetectionStatus("idle");
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!cameraActive || !modelsReady || !videoRef.current) {
      return undefined;
    }

    detectionTimerRef.current = window.setInterval(async () => {
      const video = videoRef.current;

      if (!video || video.readyState < 2) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      try {
        const detections = await faceapi.detectAllFaces(video, detectorOptions);
        setFaceCount(detections.length);

        if (detections.length === 1) {
          setDetectionStatus("detected");
        } else if (detections.length > 1) {
          setDetectionStatus("multiple");
        } else {
          setDetectionStatus("none");
        }
      } catch (error) {
        setCameraError(error.message || "Face detection failed.");
        setDetectionStatus("error");
      }
    }, 700);

    return () => {
      if (detectionTimerRef.current) {
        clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
    };
  }, [cameraActive, modelsReady]);

  const startCamera = async () => {
    setCameraError("");
    setDescriptor(null);
    setDetectionStatus("loading");

    try {
      if (!modelsReady) {
        setLoadingModels(true);
        await loadFaceAPIModels();
        setModelsReady(true);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 960 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setDetectionStatus("none");
    } catch (error) {
      const errorMessage = error?.message || "";
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError" ||
        (error.message && error.message.toLowerCase().includes("permission denied"))
      ) {
        setCameraError(
          "Camera access denied. Please enable permissions or use manual attendance."
        );
      } else {
        setCameraError(
          errorMessage.includes("models")
            ? errorMessage
            : "Unable to open webcam. Please check your camera connection."
        );
      }
      setDetectionStatus("error");
      stopCamera();
    } finally {
      setLoadingModels(false);
    }
  };

  const captureDescriptor = async () => {
    if (!isCaptureReady || !videoRef.current) {
      return;
    }

    setCapturing(true);
    setCameraError("");

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, detectorOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setDetectionStatus("none");
        setCameraError("No face found. Look directly at the camera and try again.");
        return;
      }

      if (detections.length > 1) {
        setDetectionStatus("multiple");
        setCameraError("Multiple faces found. Keep only one face visible.");
        return;
      }

      const generatedDescriptor = Array.from(detections[0].descriptor);
      setDescriptor(generatedDescriptor);
      await Promise.resolve(onDescriptorGenerated?.(generatedDescriptor));
    } catch (error) {
      setCameraError(error.message || "Unable to generate face descriptor.");
      setDetectionStatus("error");
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-brand-primary/30 bg-black shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20" />
        <div className="absolute left-4 top-4 z-10">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-xl ${
            detectionStatus === "detected"
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
              : detectionStatus === "multiple"
                ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                : "border-white/10 bg-black/40 text-brand-muted"
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              detectionStatus === "detected" ? "bg-emerald-300" : detectionStatus === "multiple" ? "bg-amber-300" : "bg-brand-muted"
            }`} />
            {detectionStatus === "detected" ? "Face Detected" : detectionStatus === "multiple" ? "Multiple Faces" : "No Face Found"}
          </span>
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`relative z-[1] aspect-video w-full bg-[#050816] object-cover transition ${
            cameraActive ? "opacity-100" : "opacity-30"
          }`}
        />

        {(!cameraActive || loadingModels) && (
          <div className="absolute inset-0 z-[2] grid place-items-center px-6 text-center">
            {loadingModels ? (
              <div className="flex flex-col items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-brand-primary/40 bg-brand-primary/10 shadow-glow">
                  <FiLoader className="animate-spin text-3xl text-brand-primary" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">Loading Models...</p>
                  <p className="mt-1 text-sm text-brand-muted">Initializing face detection engine</p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-pulse rounded-full bg-brand-primary"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : cameraError ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 shadow-lg max-w-md transition-all">
                <p className="text-sm font-semibold leading-relaxed text-red-100">{cameraError}</p>
              </div>
            ) : (
              <div>
                <FiVideo className="mx-auto text-5xl text-brand-primary" />
                <p className="mt-4 text-xl font-extrabold text-white">{idleTitle}</p>
                <p className="mt-2 max-w-md text-sm text-brand-muted">
                  {idleDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={cameraActive ? stopCamera : startCamera}
          disabled={(!cameraActive && disabled) || loadingModels}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-white transition hover:border-brand-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingModels ? <FiLoader className="animate-spin" /> : cameraActive ? <FiVideoOff /> : <FiPower />}
          {loadingModels ? "Loading Models..." : cameraActive ? stopButtonLabel : openButtonLabel}
        </button>

        <button
          type="button"
          onClick={captureDescriptor}
          disabled={!isCaptureReady}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-4 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {capturing || busy ? <FiLoader className="animate-spin" /> : <FiCamera />}
          {capturing || busy ? captureLoadingLabel : captureButtonLabel}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-brand-muted"
        >
          {faceCount === 1 ? "Ready for descriptor" : faceCount > 1 ? "One face only" : "Waiting for face"}
        </motion.div>
      </div>

      <FacePreviewCard
        cameraActive={cameraActive}
        descriptor={descriptor}
        detectionStatus={detectionStatus}
        faceCount={faceCount}
        isCaptureReady={isCaptureReady}
        modelsReady={modelsReady}
        registrationMessage={registrationMessage}
      />
    </div>
  );
};

export default WebcamScanner;
