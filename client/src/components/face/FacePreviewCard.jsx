import { FiAlertTriangle, FiCheckCircle, FiCpu, FiRadio, FiVideo } from "react-icons/fi";

const FacePreviewCard = ({
  cameraActive,
  descriptor,
  detectionStatus,
  faceCount,
  isCaptureReady,
  modelsReady,
  registrationMessage
}) => {
  const descriptorLength = descriptor?.length || 0;

  const statusTone = {
    detected: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    multiple: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    none: "border-white/10 bg-white/5 text-brand-muted",
    error: "border-red-400/30 bg-red-500/10 text-red-100",
    loading: "border-brand-primary/30 bg-brand-primary/10 text-[#C8D2FF]",
    idle: "border-white/10 bg-white/5 text-brand-muted"
  };

  const statusText = {
    detected: "Face Detected",
    multiple: "Multiple Faces Found",
    none: "No Face Found",
    error: "Scanner Error",
    loading: "Scanning...",
    idle: "Waiting for Camera"
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">Live preview</p>
          <h3 className="mt-2 text-xl font-extrabold text-white">Face Scanner State</h3>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-brand-primary">
          <FiRadio />
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className={`rounded-2xl border p-4 ${statusTone[detectionStatus] || statusTone.idle}`}>
          <div className="flex items-center gap-2 text-sm font-bold">
            {detectionStatus === "detected" ? <FiCheckCircle /> : <FiVideo />}
            {statusText[detectionStatus] || statusText.idle}
          </div>
          <p className="mt-2 text-xs opacity-80">
            {cameraActive ? `${faceCount} face${faceCount === 1 ? "" : "s"} visible` : "Camera is closed"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FiCpu />
            Descriptor
          </div>
          <p className="mt-2 text-xs text-brand-muted">
            {descriptorLength > 0 ? `Generated with ${descriptorLength} values` : "Not generated yet"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Models", modelsReady ? "Loaded" : "Waiting"],
          ["Capture", isCaptureReady ? "Ready" : "Locked"],
          ["Backend", registrationMessage ? "Saved" : "Waiting"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
            <p className="mt-2 text-sm font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {detectionStatus === "multiple" && (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm font-semibold text-amber-100">
          <FiAlertTriangle />
          Keep only one face visible before capturing a descriptor.
        </p>
      )}
    </div>
  );
};

export default FacePreviewCard;
