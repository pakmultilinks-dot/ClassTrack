import { useEffect, useState } from "react";
import { getAllAttendance } from "../../services/attendanceService";

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "present":
      return "text-emerald-300 bg-emerald-400/10";
    case "late":
      return "text-amber-300 bg-amber-400/10";
    case "absent":
      return "text-rose-300 bg-rose-400/10";
    default:
      return "text-[#C8D2FF] bg-white/5";
  }
};

const RecentActivity = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllAttendance()
      .then((data) => {
        if (!mounted) return;
        const records = data.attendance || data.records || [];
        const sorted = [...records]
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 6)
          .map((r) => ({
            id: r.id || r._id,
            name: r.studentName || "Unknown student",
            action: `${r.className || "Class"}${r.subject ? ` - ${r.subject}` : ""} marked by ${r.method === "face" ? "face scan" : "manual entry"}`,
            status: r.status,
            time: timeAgo(r.createdAt || r.date)
          }));
        setItems(sorted);
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-muted">Recent activity</p>
          <h2 className="mt-1 text-xl font-bold text-white">Live system timeline</h2>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Live
        </span>
      </div>

      <div className="mt-5 divide-y divide-white/10">
        {loading && (
          <p className="py-6 text-center text-sm text-brand-muted">Loading activity...</p>
        )}
        {!loading && items.length === 0 && (
          <p className="py-6 text-center text-sm text-brand-muted">
            No attendance activity yet. Mark attendance to see it here.
          </p>
        )}
        {items.map((activity) => (
          <div key={activity.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-bold text-white">{activity.name}</p>
              <p className="mt-1 text-sm text-brand-muted">{activity.action}</p>
            </div>
            <div className="flex items-center gap-3 sm:justify-end">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor(activity.status)}`}>
                {activity.status}
              </span>
              <span className="text-xs font-medium text-brand-muted">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
