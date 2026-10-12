import { useEffect, useState } from "react";
import { FiAlertTriangle, FiBell, FiCheckCircle, FiSave, FiSliders } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import ThemeToggle from "../components/ui/ThemeToggle";
import Toast from "../components/ui/Toast";

const accents = [
  { label: "Indigo", value: "indigo", className: "from-brand-primary to-brand-secondary" },
  { label: "Cyan", value: "cyan", className: "from-cyan-400 to-brand-primary" },
  { label: "Emerald", value: "emerald", className: "from-emerald-400 to-cyan-400" },
  { label: "Violet", value: "violet", className: "from-fuchsia-400 to-brand-secondary" }
];

const Settings = () => {
  const [accent, setAccent] = useState(() => localStorage.getItem("classtrack_accent") || "indigo");
  const [notifications, setNotifications] = useState(() => ({
    attendanceAlerts: localStorage.getItem("classtrack_notify_attendance") !== "false",
    reportDigest: localStorage.getItem("classtrack_notify_reports") !== "false",
    systemStatus: localStorage.getItem("classtrack_notify_system") !== "false"
  }));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("classtrack_accent", accent);
  }, [accent]);

  const toggleNotification = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("classtrack_notify_attendance", String(notifications.attendanceAlerts));
    localStorage.setItem("classtrack_notify_reports", String(notifications.reportDigest));
    localStorage.setItem("classtrack_notify_system", String(notifications.systemStatus));
    setToast({ type: "success", message: "Settings saved locally." });
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
                Tune local display preferences and notification settings for the dashboard experience.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                <FiSliders />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white">Appearance</h2>
                <p className="text-sm text-brand-muted">Switch theme and preview accent choices.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-sm font-semibold text-white">Theme mode</p>
              <ThemeToggle />
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Accent color</p>
              <p className="mt-2 text-xs text-brand-muted">Note: Colors are locked to ClassTrack brand teal/amber in this layout.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {accents.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAccent(item.value)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      accent === item.value
                        ? "border-brand-primary/50 bg-brand-primary/10 text-white"
                        : "border-white/10 bg-white/5 text-brand-muted hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${item.className}`} />
                      {item.label}
                    </span>
                    {accent === item.value && <FiCheckCircle />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                  <FiBell />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Notifications</h2>
                  <p className="text-sm text-brand-muted">Local preferences for future notification surfaces.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  ["attendanceAlerts", "Attendance alerts", "Notify me about low attendance and duplicate marks."],
                  ["reportDigest", "Report digest", "Show reminders for summary and export reviews."],
                  ["systemStatus", "System status", "Surface backend and module readiness updates."]
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
                    <span className={`h-7 w-12 rounded-full p-1 transition ${
                      notifications[key] ? "bg-brand-primary" : "bg-white/10"
                    }`}>
                      <span className={`block h-5 w-5 rounded-full bg-white transition ${
                        notifications[key] ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-100">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="mt-1 flex-none" />
                <div>
                  <p className="font-extrabold">Local JSON database mode</p>
                  <p className="mt-2 text-sm leading-6">
                    This ClassTrack version stores backend data in a local JSON file. Back up your project folder before clearing local files or moving machines.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-sm font-bold text-white shadow-glow"
            >
              <FiSave />
              Save Settings
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
