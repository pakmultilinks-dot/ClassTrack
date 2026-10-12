import { useEffect, useState } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { getLowAttendanceReport } from "../../services/reportService";

const LowAttendanceTable = () => {
  const [threshold, setThreshold] = useState(75);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLowAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getLowAttendanceReport(threshold || 75);
      setStudents(data.students || []);
    } catch (apiError) {
      setStudents([]);
      setError(apiError.response?.data?.message || "Unable to load low attendance report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowAttendance();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadLowAttendance();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-200">
              <FiAlertTriangle />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Low Attendance</h2>
              <p className="text-sm text-brand-muted">Find students below a selected attendance percentage.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="0"
              max="100"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70 sm:w-36"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-bold text-white shadow-glow disabled:opacity-70"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Fetch
            </button>
          </div>
        </div>
      </form>

      {error && <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">{error}</div>}

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Roll</th>
                <th className="px-5 py-4">Section</th>
                <th className="px-5 py-4">Marked</th>
                <th className="px-5 py-4">Present</th>
                <th className="px-5 py-4">Absent</th>
                <th className="px-5 py-4">Late</th>
                <th className="px-5 py-4">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-5 py-5" colSpan="9">
                    <div className="h-5 animate-pulse rounded-full bg-white/10" />
                  </td>
                </tr>
              ))}

              {!loading && students.map((report) => (
                <tr key={report.student.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white">{report.student.fullName}</p>
                    <p className="mt-1 text-xs text-brand-muted">{report.student.studentId}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-muted">{report.student.email || "-"}</td>
                  <td className="px-5 py-4 text-sm text-white">{report.student.rollNumber || "-"}</td>
                  <td className="px-5 py-4 text-sm text-white">{report.student.section || "-"}</td>
                  <td className="px-5 py-4 text-sm text-brand-muted">{report.totalClassesMarked}</td>
                  <td className="px-5 py-4 text-sm text-emerald-300">{report.presentCount}</td>
                  <td className="px-5 py-4 text-sm text-red-200">{report.absentCount}</td>
                  <td className="px-5 py-4 text-sm text-amber-200">{report.lateCount}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-extrabold text-red-100">
                      {report.attendancePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && students.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-white">No low attendance students</p>
            <p className="mt-2 text-sm text-brand-muted">No active student is currently below {threshold || 75}%.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowAttendanceTable;
