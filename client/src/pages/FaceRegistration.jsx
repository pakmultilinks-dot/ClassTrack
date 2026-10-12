import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers
} from "react-icons/fi";
import WebcamScanner from "../components/face/WebcamScanner";
import DashboardLayout from "../layouts/DashboardLayout";
import { getFaceStatus, registerFace, removeFaceData } from "../services/faceService";
import { getStudents } from "../services/studentService";

const FaceRegistration = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [faceStatus, setFaceStatus] = useState(null);
  const [capturedDescriptor, setCapturedDescriptor] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedStudent = useMemo(() => {
    return students.find((student) => student.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const loadStudents = async () => {
    setLoadingStudents(true);
    setError("");

    try {
      const data = await getStudents();
      const studentList = data.students || [];
      setStudents(studentList);

      if (!selectedStudentId && studentList.length > 0) {
        setSelectedStudentId(studentList[0].id);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load students. Please make sure the backend is running.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadFaceStatus = async (studentId) => {
    if (!studentId) {
      setFaceStatus(null);
      return;
    }

    setLoadingStatus(true);
    setError("");

    try {
      const data = await getFaceStatus(studentId);
      setFaceStatus(data);
    } catch (apiError) {
      setFaceStatus(null);
      setError(apiError.response?.data?.message || "Unable to load face status for this student.");
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadFaceStatus(selectedStudentId);
  }, [selectedStudentId]);

  const handleStudentChange = (event) => {
    setSelectedStudentId(event.target.value);
    setCapturedDescriptor(null);
    setMessage("");
    setError("");
  };

  const handleDescriptorGenerated = (descriptor) => {
    setCapturedDescriptor(descriptor);
    setMessage("Face descriptor captured. Save it to register this student.");
    setError("");
  };

  const handleRegisterFace = async () => {
    if (!selectedStudent) {
      setError("Please select a student first.");
      return;
    }

    if (!capturedDescriptor?.length) {
      setError("Capture a face descriptor before saving.");
      return;
    }

    setActionLoading("register");
    setError("");
    setMessage("");

    try {
      const data = await registerFace(selectedStudent.id, capturedDescriptor);
      setMessage(data.message || "Face descriptor registered successfully.");
      setCapturedDescriptor(null);
      await loadFaceStatus(selectedStudent.id);
      await loadStudents();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to register face descriptor.");
    } finally {
      setActionLoading("");
    }
  };

  const handleRemoveFace = async () => {
    if (!selectedStudent) {
      setError("Please select a student first.");
      return;
    }

    const confirmed = window.confirm(`Remove all face data for ${selectedStudent.fullName}?`);

    if (!confirmed) {
      return;
    }

    setActionLoading("remove");
    setError("");
    setMessage("");

    try {
      const data = await removeFaceData(selectedStudent.id);
      setMessage(data.message || "Face data removed successfully.");
      setCapturedDescriptor(null);
      await loadFaceStatus(selectedStudent.id);
      await loadStudents();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to remove face data.");
    } finally {
      setActionLoading("");
    }
  };

  const handleRefreshStatus = async () => {
    if (!selectedStudent) {
      setError("Please select a student first.");
      return;
    }

    setActionLoading("refresh");
    setMessage("");
    await loadFaceStatus(selectedStudent.id);
    setActionLoading("");
  };

  const samplesCount = faceStatus?.samplesCount ?? selectedStudent?.faceDescriptors?.length ?? 0;
  const isFaceRegistered = Boolean(faceStatus?.faceRegistered ?? selectedStudent?.faceRegistered);
  const canSaveDescriptor = Boolean(selectedStudent && capturedDescriptor?.length && samplesCount < 5 && !actionLoading);

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
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Face registration</p>
                <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                  Capture real face descriptors
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
                  Use the browser webcam and face-api.js to detect one face, generate a descriptor, and save it to the existing backend.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-brand-muted">Browser AI stack</p>
                <p className="mt-3 max-w-xs text-sm font-bold text-white">
                  TinyFaceDetector + FaceLandmark68Net + FaceRecognitionNet
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {(error || message) && (
          <div className={`rounded-3xl border p-4 text-sm font-semibold leading-6 ${
            error
              ? "border-red-400/30 bg-red-500/10 text-red-100"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
          }`}>
            {error || message}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="space-y-5"
          >
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow">
                  <FiSearch />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-white">Select Student</p>
                  <p className="text-sm text-brand-muted">Choose a student before opening the webcam.</p>
                </div>
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-semibold text-white">Student</span>
                <select
                  value={selectedStudentId}
                  onChange={handleStudentChange}
                  disabled={loadingStudents}
                  className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary/70 disabled:opacity-70"
                >
                  <option value="">{loadingStudents ? "Loading students..." : "Select student"}</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fullName} - {student.studentId}
                    </option>
                  ))}
                </select>
              </label>

              {loadingStudents && (
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-12 animate-pulse rounded-2xl bg-white/10" />
                  ))}
                </div>
              )}

              {!loadingStudents && students.length === 0 && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-lg font-bold text-white">No students available</p>
                  <p className="mt-2 text-sm text-brand-muted">Add students first, then return here to register face descriptors.</p>
                </div>
              )}

              {!loadingStudents && selectedStudent && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-extrabold text-white">{selectedStudent.fullName}</p>
                      <p className="mt-1 text-sm text-brand-muted">{selectedStudent.studentId}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                      isFaceRegistered ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
                    }`}>
                      <FiUserCheck />
                      {isFaceRegistered ? "Registered" : "Not registered"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Roll Number", selectedStudent.rollNumber || "-"],
                      ["Class ID", selectedStudent.classId || "Unassigned"],
                      ["Section", selectedStudent.section || "-"],
                      ["Samples", samplesCount]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
                        <p className="mt-2 text-sm font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Status center</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">Face Data Status</h2>
                  <p className="mt-2 text-sm text-brand-muted">Save captured descriptors, remove saved data, or refresh status.</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-brand-primary">
                  <FiShield size={21} />
                </span>
              </div>

              {!selectedStudent && !loadingStudents && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                  <FiUsers className="mx-auto text-3xl text-brand-primary" />
                  <p className="mt-4 text-lg font-bold text-white">No student selected</p>
                  <p className="mt-2 text-sm text-brand-muted">Select a student to register face data.</p>
                </div>
              )}

              {selectedStudent && (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5">
                    {loadingStatus ? (
                      <div className="space-y-4">
                        <div className="h-6 w-48 animate-pulse rounded-full bg-white/10" />
                        <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
                        <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-brand-muted">Current status</p>
                          <p className={`mt-2 text-3xl font-extrabold ${
                            isFaceRegistered ? "text-emerald-300" : "text-amber-200"
                          }`}>
                            {isFaceRegistered ? "Face registered" : "Face not registered"}
                          </p>
                          <p className="mt-2 text-sm text-brand-muted">
                            {samplesCount} of 5 sample descriptors stored.
                          </p>
                        </div>
                        <span className={`grid h-16 w-16 place-items-center rounded-3xl ${
                          isFaceRegistered ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
                        }`}>
                          {isFaceRegistered ? <FiCheckCircle size={28} /> : <FiCamera size={28} />}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-brand-muted">Captured descriptor</p>
                    <p className="mt-2 text-2xl font-extrabold text-white">
                      {capturedDescriptor?.length ? `${capturedDescriptor.length} values ready` : "No descriptor captured"}
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <button
                      type="button"
                      onClick={handleRegisterFace}
                      disabled={!canSaveDescriptor}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-4 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSave />
                      {actionLoading === "register" ? "Saving..." : "Save Descriptor"}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFace}
                      disabled={Boolean(actionLoading) || samplesCount === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-brand-muted transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 />
                      {actionLoading === "remove" ? "Removing..." : "Remove Face Data"}
                    </button>

                    <button
                      type="button"
                      onClick={handleRefreshStatus}
                      disabled={Boolean(actionLoading)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-brand-muted transition hover:border-brand-primary/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiRefreshCw className={actionLoading === "refresh" ? "animate-spin" : ""} />
                      Refresh Status
                    </button>
                  </div>

                  {samplesCount >= 5 && (
                    <p className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm font-semibold text-amber-100">
                      This student already has the maximum 5 sample descriptors.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="glass-panel rounded-3xl p-5 sm:p-6"
          >
            <WebcamScanner
              disabled={!selectedStudent || samplesCount >= 5}
              onDescriptorGenerated={handleDescriptorGenerated}
              registrationMessage={message}
            />
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default FaceRegistration;
