import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiTrendingUp,
  FiUserX,
  FiUsers
} from "react-icons/fi";

const summaryItems = [
  { key: "totalStudents", label: "Total Students", icon: FiUsers, accent: "from-brand-primary to-brand-secondary" },
  { key: "totalClasses", label: "Total Classes", icon: FiLayers, accent: "from-cyan-400 to-brand-primary" },
  { key: "totalAttendanceRecords", label: "Attendance Records", icon: FiActivity, accent: "from-[#C8D2FF] to-brand-primary" },
  { key: "totalPresent", label: "Present", icon: FiCheckCircle, accent: "from-emerald-400 to-cyan-400" },
  { key: "totalAbsent", label: "Absent", icon: FiUserX, accent: "from-red-400 to-rose-500" },
  { key: "totalLate", label: "Late", icon: FiClock, accent: "from-amber-400 to-brand-secondary" },
  { key: "todayAttendanceCount", label: "Today Count", icon: FiTrendingUp, accent: "from-brand-secondary to-fuchsia-400" }
];

const SummarySkeleton = () => (
  <div className="glass-panel rounded-3xl p-5">
    <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
    <div className="mt-4 h-9 w-20 animate-pulse rounded-2xl bg-white/10" />
    <div className="mt-5 h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
  </div>
);

const SummaryCards = ({ loading, summary }) => {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => <SummarySkeleton key={index} />)}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.key} className="glass-panel rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-brand-muted">{item.label}</p>
                <p className="mt-3 text-3xl font-extrabold text-white">{summary?.[item.key] ?? 0}</p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-glow`}>
                <Icon size={20} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
