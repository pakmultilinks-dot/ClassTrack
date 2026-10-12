import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiCamera, FiClipboard, FiLayers, FiUsers } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getAllAttendance } from "../services/attendanceService";
import { getClasses } from "../services/classService";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeacherDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [classData, attendanceData] = await Promise.all([
          getClasses(),
          getAllAttendance()
        ]);

        setClasses(classData.classes || []);
        setAttendance(attendanceData.attendance || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load teacher dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadTeacherDashboard();
  }, []);

  const assignedClasses = useMemo(() => {
    return classes.filter((classItem) => classItem.teacherId === user?.id);
  }, [classes, user]);

  const assignedClassIds = useMemo(() => assignedClasses.map((classItem) => classItem.id), [assignedClasses]);
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendanceCount = attendance.filter((record) => {
    return record.date === today && assignedClassIds.includes(record.classId);
  }).length;

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
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Teacher dashboard</p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                Welcome back, {user?.fullName || "Teacher"}.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                Manage assigned classes and jump quickly into face scan or manual attendance workflows.
              </p>
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Assigned Classes", loading ? "..." : assignedClasses.length, FiLayers],
            ["Today Attendance", loading ? "..." : todayAttendanceCount, FiUsers],
            ["Teacher Role", "Active", FiClipboard]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass-panel rounded-3xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-muted">{label}</p>
                  <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                  <Icon />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link to="/attendance-scan" className="glass-panel rounded-3xl p-5 transition hover:-translate-y-1 hover:border-brand-primary/40">
            <FiCamera className="text-2xl text-brand-primary" />
            <p className="mt-4 text-xl font-extrabold text-white">Scan Attendance</p>
            <p className="mt-2 text-sm text-brand-muted">Use the webcam face scanner to mark attendance.</p>
          </Link>
          <Link to="/manual-attendance" className="glass-panel rounded-3xl p-5 transition hover:-translate-y-1 hover:border-brand-primary/40">
            <FiClipboard className="text-2xl text-brand-primary" />
            <p className="mt-4 text-xl font-extrabold text-white">Manual Attendance</p>
            <p className="mt-2 text-sm text-brand-muted">Mark present, absent, or late manually for a class.</p>
          </Link>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Assigned classes</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">Your Classes</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {loading && Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-3xl bg-white/10" />
            ))}

            {!loading && assignedClasses.map((classItem) => (
              <article key={classItem.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-lg font-extrabold text-white">{classItem.className}</p>
                <p className="mt-1 text-sm text-brand-muted">Section {classItem.section}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(classItem.subjects || []).map((subject) => (
                    <span key={subject} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#C8D2FF]">
                      {subject}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {!loading && assignedClasses.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-lg font-bold text-white">No assigned classes found</p>
              <p className="mt-2 text-sm text-brand-muted">Classes assigned to your teacher ID will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
