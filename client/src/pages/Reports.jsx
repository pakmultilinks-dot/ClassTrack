import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiPieChart } from "react-icons/fi";
import AttendanceCharts from "../components/reports/AttendanceCharts";
import ClassReportPanel from "../components/reports/ClassReportPanel";
import LowAttendanceTable from "../components/reports/LowAttendanceTable";
import StudentReportPanel from "../components/reports/StudentReportPanel";
import SummaryCards from "../components/reports/SummaryCards";
import ExportButtons from "../components/reports/ExportButtons";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAllAttendance } from "../services/attendanceService";
import { getClasses } from "../services/classService";
import { getSummaryReport } from "../services/reportService";
import { getStudents } from "../services/studentService";
import { exportAllAttendanceExcel } from "../utils/exportExcel";
import { exportSummaryReportPdf } from "../utils/exportPdf";

const tabs = ["Summary", "Student Report", "Class Report", "Low Attendance"];

const defaultSummary = {
  totalStudents: 0,
  totalClasses: 0,
  totalAttendanceRecords: 0,
  totalPresent: 0,
  totalAbsent: 0,
  totalLate: 0,
  todayAttendanceCount: 0
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [summary, setSummary] = useState(defaultSummary);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState([]);
  const [chartRecords, setChartRecords] = useState([]);
  const [classWiseData, setClassWiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBaseData = async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryData, studentData, classData, attendanceData] = await Promise.all([
        getSummaryReport(),
        getStudents(),
        getClasses(),
        getAllAttendance()
      ]);

      setSummary(summaryData.summary || defaultSummary);
      setStudents(studentData.students || []);
      setClasses(classData.classes || []);
      setAllAttendanceRecords(attendanceData.attendance || []);
      setChartRecords(attendanceData.attendance || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load reports. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  const tabContent = useMemo(() => {
    if (activeTab === "Student Report") {
      return (
        <StudentReportPanel
          students={students}
          onRecordsChange={setChartRecords}
        />
      );
    }

    if (activeTab === "Class Report") {
      return (
        <ClassReportPanel
          classes={classes}
          onClassWiseChange={setClassWiseData}
          onRecordsChange={setChartRecords}
        />
      );
    }

    if (activeTab === "Low Attendance") {
      return <LowAttendanceTable />;
    }

    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="text-center lg:text-left">
            <FiPieChart className="mx-auto text-4xl text-brand-primary lg:mx-0" />
            <p className="mt-4 text-2xl font-extrabold text-white">Summary Analytics</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
              The cards and charts above summarize attendance health across students, classes, and daily records.
            </p>
          </div>
          <ExportButtons
            disabled={loading}
            excelLabel="Export All Attendance Excel"
            onExportExcel={() => exportAllAttendanceExcel(allAttendanceRecords)}
            onExportPdf={() => exportSummaryReportPdf(summary)}
            pdfLabel="Export Summary PDF"
          />
        </div>
      </div>
    );
  }, [activeTab, allAttendanceRecords, classes, loading, students, summary]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="premium-border rounded-[2rem]"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] p-6 shadow-soft sm:p-8">
            <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-brand-secondary/15 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Reports</p>
                <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                  Attendance analytics dashboard
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                  Review attendance health, student performance, class trends, and low attendance risk from one reporting surface.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                    <FiBarChart2 />
                  </span>
                  <div>
                    <p className="text-sm text-brand-muted">Records</p>
                    <p className="text-lg font-extrabold text-white">{summary.totalAttendanceRecords} total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold leading-6 text-red-100">
            {error}
          </div>
        )}

        <SummaryCards loading={loading} summary={summary} />

        <AttendanceCharts
          classWiseData={classWiseData}
          records={chartRecords}
          summary={summary}
        />

        <div className="glass-panel rounded-3xl p-2">
          <div className="grid gap-2 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);

                  if (tab === "Summary") {
                    setChartRecords(allAttendanceRecords);
                    setClassWiseData([]);
                  }
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow"
                    : "text-brand-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {tabContent}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
