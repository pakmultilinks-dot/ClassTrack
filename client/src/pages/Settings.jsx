import { useState } from "react";
import { FiBell, FiCheckCircle, FiDatabase, FiSave, FiSliders } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import ThemeToggle from "../components/ui/ThemeToggle";
import Toast from "../components/ui/Toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(() => ({
    attendanceAlerts: localStorage.getItem("classtrack_notify_attendance") !== "false",
    reportDigest: localStorage.getItem("classtrack_notify_reports") !== "false"
  }));
  const [alertThreshold, setAlertThreshold] = useState(() => {
    const saved = parseInt(localStorage.getItem("classtrack_alert_threshold") || "75", 10);
    return Number.isNaN(saved) ? 75 : saved;
  });
  const [toast, setToast] = useState(null);

  const toggleNotification = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("classtrack_notify_attendance", String(notifications.attendanceAlerts));
    localStorage.setItem("classtrack_notify_reports", String(notifications.reportDigest));
    localStorage.setItem("classtrack_alert_threshold", String(alertThreshold));
    setToast({ type: "success", message: "Settings saved." });
  };

  return (
    <DashboardLayout>
      <Toast
        message={toast?.message}
        onClose={() => setToast(null)}
        title="Settings"
        type={toast?.type}
      />

      <div className="space-y-6">
        <section className="premium-border rounded-[2rem]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] p-6 shadow-soft sm:p-8">
            <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Settings</p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">ClassTrack Preferences</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                Tune display preferences and attendance alert settings.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                <FiSliders />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white">Appearance</h2>
                <p className="text-sm text-brand-muted">Switch between dark and light theme.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-sm font-semibold text-white">Theme mode</p>
              <ThemeToggle />
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                <FiBell />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white">Attendance alerts</h2>
                <p className="text-sm text-brand-muted">Control low-attendance warnings in the top bar.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["attendanceAlerts", "Low attendance badge", "Show a count badge on the bell icon when students fall below the threshold."],
                ["reportDigest", "Report reminders", "Highlight the reports section when alerts are active."]
              ].map(([key, label, description]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleNotification(key)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-brand-primary/40"
                >
                  <span>
                    <span className="block text-sm font-bold text-white">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-brand-muted">{description}</span>
                  </span>
                  <span className={`h-7 w-12 flex-none rounded-full p-1 transition ${
                    notifications[key] ? "bg-brand-primary" : "bg-white/10"
                  }`}>
                    <span className={`block h-5 w-5 rounded-full bg-white transition ${
                      notifications[key] ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </span>
                </button>
              ))}

              <label className="block rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="block text-sm font-bold text-white">Alert threshold</span>
                <span className="mt-1 block text-xs text-brand-muted">Students below this attendance % trigger an alert.</span>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-primary"
                  />
                  <span className="w-14 text-right text-sm font-bold text-white">{alertThreshold}%</span>
                </div>
              </label>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-emerald-100">
            <div className="flex items-start gap-3">
              <FiDatabase className="mt-1 flex-none" />
              <div>
                <p className="font-extrabold flex items-center gap-2">
                  Cloud database active <FiCheckCircle />
                </p>
                <p className="mt-2 text-sm leading-6">
                  Attendance data is persisted to secure cloud storage and survives server restarts and redeployments.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-sm font-bold text-white shadow-glow"
          >
            <FiSave />
            Save Settings
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
