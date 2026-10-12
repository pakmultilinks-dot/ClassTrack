import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const statusColors = ["#22C55E", "#EF4444", "#F59E0B"];

const ChartShell = ({ children, title, subtitle }) => (
  <div className="glass-panel rounded-3xl p-5">
    <div>
      <p className="text-lg font-extrabold text-white">{title}</p>
      <p className="mt-1 text-sm text-brand-muted">{subtitle}</p>
    </div>
    <div className="mt-5 h-72">
      {children}
    </div>
  </div>
);

const EmptyChart = ({ message }) => (
  <div className="grid h-full place-items-center rounded-3xl border border-white/10 bg-white/5 text-center">
    <div>
      <p className="text-lg font-bold text-white">No chart data</p>
      <p className="mt-2 text-sm text-brand-muted">{message}</p>
    </div>
  </div>
);

const buildTrendData = (records = []) => {
  const byDate = records.reduce((map, record) => {
    const date = record.date || "Unknown";
    map[date] = (map[date] || 0) + 1;
    return map;
  }, {});

  return Object.entries(byDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-8);
};

const buildClassWiseData = (classWiseData = []) => {
  return classWiseData
    .filter((item) => item.totalClassesMarked > 0)
    .map((item) => ({
      name: item.fullName,
      percentage: item.attendancePercentage
    }));
};

const AttendanceCharts = ({ classWiseData = [], records = [], summary }) => {
  const statusData = [
    { name: "Present", value: summary?.totalPresent || 0 },
    { name: "Absent", value: summary?.totalAbsent || 0 },
    { name: "Late", value: summary?.totalLate || 0 }
  ].filter((item) => item.value > 0);
  const trendData = buildTrendData(records);
  const classData = buildClassWiseData(classWiseData);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <ChartShell title="Present / Absent / Late" subtitle="Overall attendance status split">
        {statusData.length === 0 ? (
          <EmptyChart message="Attendance records will appear here after scans or manual marks." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={4}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={statusColors[index % statusColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#10172A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartShell>

      <ChartShell title="Attendance Trend" subtitle="Recent records grouped by date">
        {trendData.length === 0 ? (
          <EmptyChart message="Select a student or class with records to see a trend." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#10172A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="count" fill="#5B5BF7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartShell>

      <ChartShell title="Class-Wise Attendance" subtitle="Student percentages in selected class">
        {classData.length === 0 ? (
          <EmptyChart message="Select a class with attendance records to compare students." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} interval={0} />
              <YAxis stroke="#94A3B8" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#10172A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="percentage" fill="#7B61FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartShell>
    </div>
  );
};

export default AttendanceCharts;
