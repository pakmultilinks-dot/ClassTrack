const activities = [
  { name: "Ali Khan", action: "Marked present by face scan", time: "2 min ago", status: "Present" },
  { name: "Sara Ahmed", action: "Face descriptor registered", time: "18 min ago", status: "Ready" },
  { name: "BS Computer Science", action: "Computer class attendance synced", time: "42 min ago", status: "Synced" },
  { name: "Low Attendance Alert", action: "3 students need review", time: "1 hr ago", status: "Alert" }
];

const RecentActivity = () => {
  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-muted">Recent activity</p>
          <h2 className="mt-1 text-xl font-bold text-white">Live system timeline</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-muted">
          Static preview
        </span>
      </div>

      <div className="mt-5 divide-y divide-white/10">
        {activities.map((activity) => (
          <div key={`${activity.name}-${activity.time}`} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-bold text-white">{activity.name}</p>
              <p className="mt-1 text-sm text-brand-muted">{activity.action}</p>
            </div>
            <div className="flex items-center gap-3 sm:justify-end">
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#C8D2FF]">
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
