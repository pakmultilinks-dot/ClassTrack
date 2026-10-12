import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiLayers, FiTrendingUp, FiUsers } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import StatCard from "../components/dashboard/StatCard";
import { useAuth } from "../context/AuthContext";
import { getSummaryReport } from "../services/reportService";

const statuses = [
  { label: "Backend Connected", value: "Online", tone: "text-emerald-300" },
  { label: "Face Module Ready", value: "Ready", tone: "text-[#C8D2FF]" },
  { label: "Reports Active", value: "Active", tone: "text-emerald-300" }
];

const defaultSummary = {
  totalStudents: 0,
  totalClasses: 0,
  totalAttendanceRecords: 0,
  totalPresent: 0,
  totalAbsent: 0,
  totalLate: 0,
  todayAttendanceCount: 0
};

const StatSkeleton = () => {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-9 w-20 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setLoadingSummary(true);
      setSummaryError("");

      try {
        const data = await getSummaryReport();
        setSummary(data.summary || defaultSummary);
      } catch (error) {
        setSummaryError(
          error.response?.data?.message ||
          "Unable to load dashboard data. Please check your connection and try again."
        );
      } finally {
        setLoadingSummary(false);
      }
    };

    loadSummary();
  }, []);

  const presentRate = summary.totalAttendanceRecords === 0
    ? 0
    : Math.round((summary.totalPresent / summary.totalAttendanceRecords) * 100);

  const stats = useMemo(() => ([
    {
      title: "Total Students",
      value: summary.totalStudents,
      trend: "Synced from backend",
      icon: FiUsers,
      accent: "from-brand-primary to-brand-secondary"
    },
    {
      title: "Total Classes",
      value: summary.totalClasses,
      trend: "Active class records",
      icon: FiLayers,
      accent: "from-cyan-400 to-brand-primary"
    },
    {
      title: "Present Today",
      value: summary.todayAttendanceCount,
      trend: `${summary.totalPresent} total present`,
      icon: FiCheckCircle,
      accent: "from-emerald-400 to-cyan-400"
    },
    {
      title: "Total Attendance",
      value: summary.totalAttendanceRecords,
      trend: `${summary.totalPresent} present - ${summary.totalAbsent} absent - ${summary.totalLate} late`,
      icon: FiAlertTriangle,
      accent: "from-amber-400 to-brand-secondary"
    }
  ]), [summary]);

  const liveStatuses = summaryError
    ? [
        { label: "Backend Connected", value: "Offline", tone: "text-red-300" },
        { label: "Face Module Ready", value: "Waiting", tone: "text-amber-300" },
        { label: "Reports Active", value: "Unavailable", tone: "text-red-300" }
      ]
    : statuses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="premium-border rounded-[2rem]"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] p-6 shadow-soft sm:p-8">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-brand-primary/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-brand-secondary/20 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">
                  ClassTrack command center
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-5xl">
                  Manage attendance with clarity, {user?.fullName?.split(" ")[0] || "Admin"}.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-brand-muted">
                  Monitor student activity, class readiness, face registration workflows, and report status from one polished admin surface.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow">
                    <FiTrendingUp size={24} />
                  </span>
                  <div>
                    <p className="text-sm text-brand-muted">Today performance</p>
                    <p className="text-2xl font-extrabold text-white">
                      {loadingSummary ? "..." : `${presentRate}%`}
                    </p>
                  </div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-700"
                    style={{ width: `${presentRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {summaryError && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold leading-6 text-red-100">
            {summaryError}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loadingSummary
            ? Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />)
            : stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <QuickActions />
          <RecentActivity />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {liveStatuses.map((status, index) => (
            <motion.div
              key={status.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="glass-panel rounded-3xl p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-muted">{status.label}</p>
                  <p className={`mt-2 text-xl font-extrabold ${status.tone}`}>{status.value}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-brand-primary">
                  <FiCheckCircle />
                </span>
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
