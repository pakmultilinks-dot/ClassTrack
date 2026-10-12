import { useEffect, useMemo, useState } from "react";
import { FiUserCheck } from "react-icons/fi";
import { getStudentReport } from "../../services/reportService";
import { exportStudentReportExcel } from "../../utils/exportExcel";
import { exportStudentReportPdf } from "../../utils/exportPdf";
import ExportButtons from "./ExportButtons";

const StatBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
    <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
  </div>
);

const RecordsTable = ({ records }) => {
  if (!records?.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg font-bold text-white">No attendance records</p>
        <p className="mt-2 text-sm text-brand-muted">Records will appear after attendance is marked.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-[820px] w-full text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
            <tr>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Class</th>
              <th className="px-5 py-4">Subject</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Method</th>
              <th className="px-5 py-4">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {records.map((record) => (
              <tr key={record.id} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4 text-sm font-semibold text-white">{record.date}</td>
                <td className="px-5 py-4 text-sm text-brand-muted">{record.className}</td>
                <td className="px-5 py-4 text-sm text-white">{record.subject}</td>
                <td className="px-5 py-4 text-sm font-bold capitalize text-white">{record.status}</td>
                <td className="px-5 py-4 text-sm capitalize text-brand-muted">{record.method}</td>
                <td className="px-5 py-4 text-sm text-white">{typeof record.confidence === "number" ? `${record.confidence}%` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentReportPanel = ({ onRecordsChange, students }) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeStudents = useMemo(() => students || [], [students]);

  useEffect(() => {
    if (!selectedStudentId && activeStudents.length > 0) {
      setSelectedStudentId(activeStudents[0].id);
    }
  }, [activeStudents, selectedStudentId]);

  useEffect(() => {
    const loadReport = async () => {
      if (!selectedStudentId) {
        setReport(null);
        onRecordsChange?.([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getStudentReport(selectedStudentId);
        setReport(data);
        onRecordsChange?.(data.records || []);
      } catch (apiError) {
        setReport(null);
        onRecordsChange?.([]);
        setError(apiError.response?.data?.message || "Unable to load student report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedStudentId]);

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-3xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
              <FiUserCheck />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Student Report</h2>
              <p className="text-sm text-brand-muted">View individual attendance performance and history.</p>
            </div>
          </div>
          <select
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70 md:max-w-sm"
          >
            <option value="">Select student</option>
            {activeStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName} - {student.studentId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">{error}</div>}

      {loading && (
        <div className="glass-panel rounded-3xl p-5">
          <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/10" />)}
          </div>
        </div>
      )}

      {!loading && report && (
        <>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-2xl font-extrabold text-white">{report.student?.fullName}</p>
                <p className="mt-1 text-sm text-brand-muted">
                  {report.student?.studentId} - Roll {report.student?.rollNumber || "-"} - Section {report.student?.section || "-"}
                </p>
              </div>
              <span className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-extrabold text-white shadow-glow">
                {report.attendancePercentage}% Attendance
              </span>
            </div>
            <div className="mt-5">
              <ExportButtons
                onExportExcel={() => exportStudentReportExcel(report)}
                onExportPdf={() => exportStudentReportPdf(report)}
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              <StatBox label="Marked" value={report.totalClassesMarked} />
              <StatBox label="Present" value={report.presentCount} />
              <StatBox label="Absent" value={report.absentCount} />
              <StatBox label="Late" value={report.lateCount} />
              <StatBox label="Percent" value={`${report.attendancePercentage}%`} />
            </div>
          </div>
          <RecordsTable records={report.records} />
        </>
      )}
    </div>
  );
};

export default StudentReportPanel;
