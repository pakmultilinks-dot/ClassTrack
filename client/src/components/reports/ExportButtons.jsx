import { useRef, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiFileText, FiLoader } from "react-icons/fi";

const ExportButtons = ({
  disabled = false,
  excelLabel = "Export Excel",
  onExportExcel,
  onExportPdf,
  pdfLabel = "Export PDF"
}) => {
  const [loadingType, setLoadingType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [exportError, setExportError] = useState("");
  const clearTimerRef = useRef(null);

  const scheduleMessageClear = () => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    clearTimerRef.current = setTimeout(() => {
      setSuccessMessage("");
      setExportError("");
    }, 4000);
  };

  const runExport = async (type, exportHandler) => {
    if (!exportHandler || disabled) {
      return;
    }

    setLoadingType(type);
    setSuccessMessage("");
    setExportError("");

    try {
      await Promise.resolve(exportHandler());
      setSuccessMessage(`${type === "pdf" ? "PDF" : "Excel"} exported successfully.`);
      scheduleMessageClear();
    } catch (error) {
      setExportError("Export failed. Please try again.");
      scheduleMessageClear();
    } finally {
      setLoadingType("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {onExportPdf && (
          <button
            type="button"
            onClick={() => runExport("pdf", onExportPdf)}
            disabled={disabled || Boolean(loadingType)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 px-4 py-3 text-sm font-bold text-[#C8D2FF] transition hover:bg-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingType === "pdf" ? <FiLoader className="animate-spin" /> : <FiFileText />}
            {loadingType === "pdf" ? "Exporting..." : pdfLabel}
          </button>
        )}

        {onExportExcel && (
          <button
            type="button"
            onClick={() => runExport("excel", onExportExcel)}
            disabled={disabled || Boolean(loadingType)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingType === "excel" ? <FiLoader className="animate-spin" /> : <FiDownload />}
            {loadingType === "excel" ? "Exporting..." : excelLabel}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100">
          <FiCheckCircle />
          {successMessage}
        </div>
      )}

      {exportError && (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          <FiAlertCircle />
          {exportError}
        </div>
      )}
    </div>
  );
};

export default ExportButtons;
