import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getLowAttendanceReport } from "../../services/reportService";
import ThemeToggle from "../ui/ThemeToggle";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const alertsRef = useRef(null);
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Dashboard` : "Dashboard";

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "teacher") {
      const alertsEnabled = localStorage.getItem("classtrack_notify_attendance") !== "false";
      if (!alertsEnabled) {
        setAlerts([]);
        return;
      }
      const threshold = parseInt(localStorage.getItem("classtrack_alert_threshold") || "75", 10);
      getLowAttendanceReport(Number.isNaN(threshold) ? 75 : threshold)
        .then((data) => setAlerts(data.students || data.records || []))
        .catch(() => setAlerts([]));
    }
  }, [user?.role]);

  useEffect(() => {
    const close = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/students?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-brand-dark/70 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:left-72 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-11 w-11 flex-none place-items-center rounded-full border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-muted">{roleLabel}</p>
            <h1 className="truncate text-xl font-bold text-white sm:text-2xl">
              Welcome back, {user?.fullName || "there"}
            </h1>
          </div>
        </div>

        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 focus-within:border-brand-primary/50">
            <FiSearch className="flex-none text-brand-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full bg-transparent text-sm text-white placeholder:text-brand-muted focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <FiX className="text-brand-muted hover:text-white" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <div className="relative" ref={alertsRef}>
            <button
              type="button"
              onClick={() => setShowAlerts((v) => !v)}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white"
              aria-label="Attendance alerts"
            >
              <FiBell />
              {alerts.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {alerts.length > 9 ? "9+" : alerts.length}
                </span>
              )}
            </button>
            {showAlerts && (
              <div className="absolute right-0 top-14 z-40 w-80 rounded-2xl border border-white/10 bg-brand-dark p-4 shadow-2xl">
                <p className="text-sm font-bold text-white">Low attendance alerts</p>
                <p className="mt-1 text-xs text-brand-muted">Students below 75% attendance</p>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                  {alerts.length === 0 && (
                    <p className="py-4 text-center text-sm text-brand-muted">No alerts. All good.</p>
                  )}
                  {alerts.slice(0, 8).map((s) => (
                    <div key={s.id || s.studentId} className="rounded-xl bg-white/5 p-3">
                      <p className="text-sm font-bold text-white">{s.fullName || s.studentName}</p>
                      <p className="text-xs text-rose-300">{s.attendanceRate ?? s.rate}% attendance</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/reports"
                  onClick={() => setShowAlerts(false)}
                  className="mt-3 block text-center text-sm font-semibold text-brand-primary hover:underline"
                >
                  View full reports
                </Link>
              </div>
            )}
          </div>
          <Link to="/profile" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 transition hover:border-brand-primary/50">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-4 text-white">{user?.fullName || "User"}</p>
              <p className="text-xs capitalize text-brand-muted">{user?.role || "member"}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
