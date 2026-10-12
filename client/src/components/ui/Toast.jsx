import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

const toastStyles = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  error: "border-red-400/30 bg-red-500/10 text-red-100",
  warning: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  info: "border-brand-primary/30 bg-brand-primary/10 text-[#C8D2FF]"
};

const toastIcons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertTriangle,
  info: FiInfo
};

const Toast = ({ message, onClose, title, type = "info" }) => {
  if (!message) {
    return null;
  }

  const Icon = toastIcons[type] || FiInfo;

  return (
    <div className={`fixed right-4 top-24 z-50 w-[min(92vw,24rem)] rounded-3xl border p-4 shadow-soft backdrop-blur-2xl ${toastStyles[type] || toastStyles.info}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          {title && <p className="font-extrabold text-white">{title}</p>}
          <p className="text-sm font-semibold leading-6">{message}</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-current transition hover:bg-white/10" aria-label="Close toast">
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
