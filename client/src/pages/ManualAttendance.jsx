import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClipboard,
  FiRefreshCw,
  FiSave,
  FiSliders,
  FiUserX
} from "react-icons/fi";
import ManualAttendanceTable from "../components/attendance/ManualAttendanceTable";
import DashboardLayout from "../layouts/DashboardLayout";
import { bulkMarkAttendance } from "../services/attendanceService";
import { getClasses } from "../services/classService";
import { getStudents } from "../services/studentService";

const ManualAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState({});
  const [results, setResults] = useState({});
  const [saveSummary, setSaveSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedClass = useMemo(() => {
    return classes.find((classItem) => classItem.id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  const subjects = useMemo(() => {
    return Array.isArray(selectedClass?.subjects) ? selectedClass.subjects : [];
  }, [selectedClass]);

  const classStudents = useMemo(() => {
    return students.filter((student) => student.classId === selectedClassId && student.isActive !== false);
  }, [students, selectedClassId]);

  const selectedCount = useMemo(() => {
    return Object.values(statuses).filter(Boolean).length;
  }, [statuses]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [classData, studentData] = await Promise.all([
        getClasses(),
        getStudents()
      ]);
      const classList = classData.classes || [];

      setClasses(classList);
      setStudents(studentData.students || []);

      if (!selectedClassId && classList.length > 0) {
        setSelectedClassId(classList[0].id);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load manual attendance data. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubject((currentSubject) => {
        return subjects.includes(currentSubject) ? currentSubject : subjects[0];
      });
      return;
    }

    setSelectedSubject("");
  }, [subjects]);

  useEffect(() => {
    setStatuses({});
    setResults({});
    setSaveSummary(null);
  }, [selectedClassId, selectedSubject, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setStatuses((current) => ({
      ...current,
      [studentId]: status
    }));
    setResults((current) => {
      const nextResults = { ...current };
      delete nextResults[studentId];
      return nextResults;
    });
  };

  const markAll = (status) => {
    const nextStatuses = classStudents.reduce((map, student) => {
      map[student.id] = status;
      return map;
    }, {});

    setStatuses(nextStatuses);
    setResults({});
  };

  const resetSelection = () => {
    setStatuses({});
    setResults({});
    setError("");
  };

  const saveAttendance = async () => {
    if (!selectedClassId || !selectedSubject) {
      setError("Select a class and subject before saving attendance.");
      return;
    }

    const selectedEntries = Object.entries(statuses).filter(([, status]) => Boolean(status));

    if (selectedEntries.length === 0) {
      setError("Select at least one student status before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveSummary(null);

    try {
      const data = await bulkMarkAttendance({
        classId: selectedClassId,
        subject: selectedSubject,
        date: selectedDate,
        records: selectedEntries.map(([studentId, status]) => ({ studentId, status }))
      });

      const r = data.results || {};
      const nextResults = {};
      selectedEntries.forEach(([studentId]) => {
        nextResults[studentId] = { type: "success", message: "Saved" };
      });
      setResults(nextResults);
      setSaveSummary({
        marked: r.marked || 0,
        updated: r.updated || 0,
        errors: r.errors || []
      });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Manual attendance</p>
                <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                  Mark attendance without face scan
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                  Select a class and subject, choose each student status, and save attendance through the existing backend API.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                    <FiClipboard />
                  </span>
                  <div>
                    <p className="text-sm text-brand-muted">Selected statuses</p>
                    <p className="text-lg font-extrabold text-white">{selectedCount} ready to save</p>
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

        {saveSummary && (
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm font-semibold leading-6 text-emerald-100">
            Saved: {saveSummary.marked} marked, {saveSummary.updated} updated
            {saveSummary.errors.length > 0 && `, ${saveSummary.errors.length} errors`}
            {saveSummary.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs font-normal">
                {saveSummary.errors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e.studentId}: {e.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <section className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow">
              <FiSliders />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Attendance Controls</h2>
              <p className="text-sm text-brand-muted">Pick the class and subject, then apply statuses to students.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Class</span>
              <select
                value={selectedClassId}
                onChange={(event) => setSelectedClassId(event.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70 disabled:opacity-70"
              >
                <option value="">{loading ? "Loading classes..." : "Select class"}</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className} - Section {classItem.section}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Subject</span>
              <select
                value={selectedSubject}
                onChange={(event) => setSelectedSubject(event.target.value)}
                disabled={!selectedClassId || subjects.length === 0}
                className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70 disabled:opacity-70"
              >
                <option value="">
                  {!selectedClassId ? "Select class first" : subjects.length === 0 ? "No subjects available" : "Select subject"}
                </option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Date</span>
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => markAll("present")}
                disabled={classStudents.length === 0 || saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/15 disabled:opacity-60"
              >
                <FiCheckCircle />
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll("absent")}
                disabled={classStudents.length === 0 || saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/15 disabled:opacity-60"
              >
                <FiUserX />
                Mark All Absent
              </button>
              <button
                type="button"
                onClick={resetSelection}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-brand-muted transition hover:text-white disabled:opacity-60"
              >
                <FiRefreshCw />
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={saveAttendance}
              disabled={saving || selectedCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-3 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave className={saving ? "animate-pulse" : ""} />
              {saving ? "Saving Attendance..." : "Save Selected Attendance"}
            </button>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Students</p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">
                {selectedClass ? `${selectedClass.className} - Section ${selectedClass.section}` : "Select a class"}
              </h2>
            </div>
            <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-brand-muted">
              {classStudents.length} students
            </span>
          </div>

          <ManualAttendanceTable
            loading={loading}
            onStatusChange={handleStatusChange}
            results={results}
            saving={saving}
            students={classStudents}
            statuses={statuses}
          />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ManualAttendance;
