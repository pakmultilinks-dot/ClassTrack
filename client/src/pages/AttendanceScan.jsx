import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiCamera, FiCheckCircle, FiClock, FiRadio } from "react-icons/fi";
import AttendanceControls from "../components/attendance/AttendanceControls";
import ScanResultCard from "../components/attendance/ScanResultCard";
import WebcamScanner from "../components/face/WebcamScanner";
import DashboardLayout from "../layouts/DashboardLayout";
import { scanFaceAttendance } from "../services/attendanceService";
import { getClasses } from "../services/classService";

const AttendanceScan = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(null);

  const selectedClass = useMemo(() => {
    return classes.find((classItem) => classItem.id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  const subjects = useMemo(() => {
    return Array.isArray(selectedClass?.subjects) ? selectedClass.subjects : [];
  }, [selectedClass]);

  const loadClasses = async () => {
    setLoadingClasses(true);
    setError("");

    try {
      const data = await getClasses();
      const classList = data.classes || [];
      setClasses(classList);

      if (!selectedClassId && classList.length > 0) {
        setSelectedClassId(classList[0].id);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load classes. Please make sure the backend is running.");
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    loadClasses();
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

  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    setSelectedSubject("");
    setScanResult(null);
    setError("");
  };

  const buildResult = (data) => {
    const isDuplicate = data.message?.toLowerCase().includes("already marked");

    return {
      type: isDuplicate ? "duplicate" : "success",
      message: data.message,
      attendance: data.attendance,
      confidence: data.confidence ?? data.attendance?.confidence
    };
  };

  const handleDescriptorGenerated = async (descriptor) => {
    if (!selectedClassId || !selectedSubject) {
      setError("Select a class and subject before scanning attendance.");
      return;
    }

    setMarkingAttendance(true);
    setError("");
    setScanResult(null);

    try {
      const data = await scanFaceAttendance({
        descriptor,
        classId: selectedClassId,
        subject: selectedSubject
      });

      setScanResult(buildResult(data));
    } catch (apiError) {
      const data = apiError.response?.data;

      if (data?.matched === false) {
        setScanResult({
          type: "unknown",
          message: "Unknown face detected"
        });
      } else {
        setScanResult({
          type: "error",
          message: data?.message || "Unable to mark attendance. Please try again."
        });
      }
    } finally {
      setMarkingAttendance(false);
    }
  };

  const scannerDisabled = !selectedClassId || !selectedSubject || markingAttendance;

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
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Attendance scan</p>
                <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                  Mark attendance with real face scan
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                  Select a class and subject, capture one face through the webcam, and send the descriptor to the backend matcher.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                    <FiActivity />
                  </span>
                  <div>
                    <p className="text-sm text-brand-muted">Scan method</p>
                    <p className="text-lg font-extrabold text-white">Face descriptor matching</p>
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

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5">
            <AttendanceControls
              classes={classes}
              loading={loadingClasses}
              selectedClassId={selectedClassId}
              selectedSubject={selectedSubject}
              subjects={subjects}
              onClassChange={handleClassChange}
              onSubjectChange={(subject) => {
                setSelectedSubject(subject);
                setScanResult(null);
                setError("");
              }}
            />

            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Session</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">Scan Readiness</h2>
                  <p className="mt-2 text-sm text-brand-muted">Class, subject, and scanner state for the current attendance scan.</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-brand-primary">
                  <FiRadio />
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Class", selectedClass ? `${selectedClass.className} - ${selectedClass.section}` : "Not selected"],
                  ["Subject", selectedSubject || "Not selected"],
                  ["Camera", scannerDisabled ? "Waiting" : "Ready to open"],
                  ["Marking", markingAttendance ? "In progress" : "Idle"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
                    <p className="mt-2 text-sm font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${
                  selectedClassId && selectedSubject ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
                }`}>
                  {selectedClassId && selectedSubject ? <FiCheckCircle /> : <FiClock />}
                </span>
                <p className="text-sm font-semibold text-brand-muted">
                  {selectedClassId && selectedSubject
                    ? "Open the camera, keep one face visible, then capture and mark attendance."
                    : "Select a class and subject to unlock the camera controls."}
                </p>
              </div>
            </div>

            <ScanResultCard result={scanResult} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="glass-panel rounded-3xl p-5 sm:p-6"
          >
            <div className="mb-5 flex flex-col gap-2">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Live face detection</p>
              <h2 className="text-2xl font-extrabold text-white">Attendance Camera</h2>
              <p className="text-sm leading-6 text-brand-muted">
                The camera uses browser-based face-api.js detection and sends only the generated descriptor to the backend.
              </p>
            </div>

            <WebcamScanner
              busy={markingAttendance}
              captureButtonLabel="Capture and Mark Attendance"
              captureLoadingLabel="Marking Attendance..."
              disabled={scannerDisabled}
              idleDescription="Start the camera after choosing a class and subject. Keep exactly one face visible for a clean attendance scan."
              idleTitle="Attendance camera closed"
              onDescriptorGenerated={handleDescriptorGenerated}
              openButtonLabel="Start Camera"
              registrationMessage={scanResult?.type === "success" || scanResult?.type === "duplicate"}
              stopButtonLabel="Stop Camera"
            />
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceScan;
