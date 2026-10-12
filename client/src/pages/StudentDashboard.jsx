import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStudentAttendance } from "../services/attendanceService";
import { getStudents } from "../services/studentService";

const calculateStats = (records) => {
  const total = records.length;
  const present = records.filter((record) => record.status === "present").length;
  const late = records.filter((record) => record.status === "late").length;
  const absent = records.filter((record) => record.status === "absent").length;
  const attendancePercentage = total === 0 ? 0 : Math.round(((present + late) / total) * 100);

  return { absent, attendancePercentage, late, present, total };
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudentDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const studentData = await getStudents();
        const matchedStudent = (studentData.students || []).find((item) => {
          return item.id === user?.id || (item.email && user?.email && item.email === user.email);
        });

        if (!matchedStudent) {
          setStudent(null);
          setRecords([]);
          setError("No linked student profile was found for this account.");
          return;
        }

        setStudent(matchedStudent);
        const attendanceData = await getStudentAttendance(matchedStudent.id);
        setRecords(attendanceData.attendance || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load your attendance dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, [user]);

  const stats = useMemo(() => calculateStats(records), [records]);
  const isLowAttendance = stats.total > 0 && stats.attendancePercentage < 75;

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
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Student dashboard</p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                Welcome, {student?.fullName || user?.fullName || "Student"}.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                Track your attendance percentage, recent class records, and risk status from your personal dashboard.
              </p>
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Attendance", `${stats.attendancePercentage}%`, FiTrendingUp],
            ["Present", stats.present, FiCheckCircle],
            ["Late", stats.late, FiClock],
            ["Absent", stats.absent, FiAlertTriangle]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass-panel rounded-3xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-muted">{label}</p>
                  <p className="mt-3 text-3xl font-extrabold text-white">{loading ? "..." : value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                  <Icon />
                </span>
              </div>
            </div>
          ))}
        </section>

        <div className={`rounded-3xl border p-5 text-sm font-semibold ${
          isLowAttendance
            ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
            : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
        }`}>
          {isLowAttendance
            ? "Risk badge: your attendance is below 75%. Please improve your attendance."
            : "Good standing: your attendance is currently healthy."}
        </div>

        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Recent attendance</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">Latest Records</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading && Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5" colSpan="5">
                        <div className="h-5 animate-pulse rounded-full bg-white/10" />
                      </td>
                    </tr>
                  ))}

                  {!loading && records.slice(0, 8).map((record) => (
                    <tr key={record.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4 text-sm font-semibold text-white">{record.date}</td>
                      <td className="px-5 py-4 text-sm text-brand-muted">{record.className}</td>
                      <td className="px-5 py-4 text-sm text-white">{record.subject}</td>
                      <td className="px-5 py-4 text-sm font-bold capitalize text-white">{record.status}</td>
                      <td className="px-5 py-4 text-sm capitalize text-brand-muted">{record.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && records.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-white">No attendance records yet</p>
                <p className="mt-2 text-sm text-brand-muted">Your attendance history will appear here once it is marked.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
