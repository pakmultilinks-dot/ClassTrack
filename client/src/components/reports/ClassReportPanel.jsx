import { useEffect, useMemo, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { getClassReport } from "../../services/reportService";
import { exportClassReportExcel } from "../../utils/exportExcel";
import { exportClassReportPdf } from "../../utils/exportPdf";
import ExportButtons from "./ExportButtons";

const ClassReportPanel = ({ classes, onClassWiseChange, onRecordsChange }) => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeClasses = useMemo(() => classes || [], [classes]);

  useEffect(() => {
    if (!selectedClassId && activeClasses.length > 0) {
      setSelectedClassId(activeClasses[0].id);
    }
  }, [activeClasses, selectedClassId]);

  useEffect(() => {
    const loadReport = async () => {
      if (!selectedClassId) {
        setReport(null);
        onClassWiseChange?.([]);
        onRecordsChange?.([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getClassReport(selectedClassId);
        setReport(data);
        onClassWiseChange?.(data.studentWisePercentage || []);
        onRecordsChange?.(data.records || []);
      } catch (apiError) {
        setReport(null);
        onClassWiseChange?.([]);
        onRecordsChange?.([]);
        setError(apiError.response?.data?.message || "Unable to load class report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedClassId]);

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-3xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
              <FiLayers />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Class Report</h2>
              <p className="text-sm text-brand-muted">Analyze class-level records and student percentages.</p>
            </div>
          </div>
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70 md:max-w-sm"
          >
            <option value="">Select class</option>
            {activeClasses.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className} - Section {classItem.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">{error}</div>}

      {loading && (
        <div className="glass-panel rounded-3xl p-5">
          <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
          <div className="mt-5 h-52 animate-pulse rounded-3xl bg-white/10" />
        </div>
      )}

      {!loading && report && (
        <>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-2xl font-extrabold text-white">{report.class?.className}</p>
                <p className="mt-1 text-sm text-brand-muted">
                  Section {report.class?.section} - {report.totalStudents} students - {report.records?.length || 0} records
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(report.class?.subjects || []).map((subject) => (
                  <span key={subject} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#C8D2FF]">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <ExportButtons
                onExportExcel={() => exportClassReportExcel(report)}
                onExportPdf={() => exportClassReportPdf(report)}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Roll</th>
                    <th className="px-5 py-4">Marked</th>
                    <th className="px-5 py-4">Present</th>
                    <th className="px-5 py-4">Absent</th>
                    <th className="px-5 py-4">Late</th>
                    <th className="px-5 py-4">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(report.studentWisePercentage || []).map((student) => (
                    <tr key={student.studentId} className="transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{student.fullName}</p>
                        <p className="mt-1 text-xs text-brand-muted">{student.studentCode}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-white">{student.rollNumber || "-"}</td>
                      <td className="px-5 py-4 text-sm text-brand-muted">{student.totalClassesMarked}</td>
                      <td className="px-5 py-4 text-sm text-emerald-300">{student.presentCount}</td>
                      <td className="px-5 py-4 text-sm text-red-200">{student.absentCount}</td>
                      <td className="px-5 py-4 text-sm text-amber-200">{student.lateCount}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-white">{student.attendancePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Method</th>
                    <th className="px-5 py-4">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(report.records || []).map((record) => (
                    <tr key={record.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4 text-sm font-semibold text-white">{record.date}</td>
                      <td className="px-5 py-4 text-sm text-brand-muted">{record.studentName}</td>
                      <td className="px-5 py-4 text-sm text-white">{record.subject}</td>
                      <td className="px-5 py-4 text-sm font-bold capitalize text-white">{record.status}</td>
                      <td className="px-5 py-4 text-sm capitalize text-brand-muted">{record.method}</td>
                      <td className="px-5 py-4 text-sm text-white">{typeof record.confidence === "number" ? `${record.confidence}%` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(report.records || []).length === 0 && (
              <div className="p-8 text-center">
                <p className="text-lg font-bold text-white">No class records</p>
                <p className="mt-2 text-sm text-brand-muted">Attendance records for this class will appear here.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClassReportPanel;
