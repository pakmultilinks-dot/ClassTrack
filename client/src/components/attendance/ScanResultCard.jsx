import { motion } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiUserX } from "react-icons/fi";

const resultStyles = {
  success: {
    icon: FiCheckCircle,
    title: "Attendance Marked",
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
    iconBg: "bg-emerald-500/15"
  },
  duplicate: {
    icon: FiClock,
    title: "Already Marked",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-100",
    iconBg: "bg-amber-500/15"
  },
  unknown: {
    icon: FiUserX,
    title: "Unknown Face Detected",
    border: "border-red-400/30",
    bg: "bg-red-500/10",
    text: "text-red-100",
    iconBg: "bg-red-500/15"
  },
  error: {
    icon: FiAlertTriangle,
    title: "Scan Failed",
    border: "border-red-400/30",
    bg: "bg-red-500/10",
    text: "text-red-100",
    iconBg: "bg-red-500/15"
  },
  idle: {
    icon: FiAlertTriangle,
    title: "No Scan Yet",
    border: "border-white/10",
    bg: "bg-white/5",
    text: "text-brand-muted",
    iconBg: "bg-white/8"
  }
};

const ScanResultCard = ({ result }) => {
  const type = result?.type || "idle";
  const style = resultStyles[type] || resultStyles.idle;
  const Icon = style.icon;
  const attendance = result?.attendance || {};
  const confidence = result?.confidence ?? attendance.confidence;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-3xl border ${style.border} ${style.bg} p-5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-bold uppercase tracking-[0.22em] ${style.text}`}>Scan result</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{result?.title || style.title}</h3>
          <p className={`mt-2 text-sm leading-6 ${style.text}`}>
            {result?.message || "Capture a face to mark attendance for the selected class and subject."}
          </p>
        </div>
        <span className={`grid h-14 w-14 flex-none place-items-center rounded-2xl ${style.iconBg} ${style.text}`}>
          <Icon size={24} />
        </span>
      </div>

      {type === "unknown" && (
        <p className="mt-5 rounded-2xl border border-red-400/25 bg-black/15 p-4 text-sm font-semibold text-red-100">
          Register this student's face first or try again with better lighting.
        </p>
      )}

      {attendance.id && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Student", attendance.studentName || "-"],
            ["Student Code", attendance.studentCode || "-"],
            ["Class", attendance.className || "-"],
            ["Subject", attendance.subject || "-"],
            ["Status", attendance.status || "-"],
            ["Date", attendance.date || "-"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
              <p className="mt-2 text-sm font-bold capitalize text-white">{value}</p>
            </div>
          ))}
        </div>
      )}

      {typeof confidence === "number" && (
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="text-sm font-semibold text-brand-muted">Confidence</span>
          <span className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-3 py-1 text-sm font-extrabold text-white">
            {confidence}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ScanResultCard;
