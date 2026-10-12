import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiEdit3, FiPlus, FiSearch, FiTrash2, FiUpload, FiUserCheck, FiX } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { getClasses } from "../services/classService";
import { bulkImportStudents, createStudent, deleteStudent, getStudents, updateStudent } from "../services/studentService";

const emptyStudentForm = {
  studentId: "",
  fullName: "",
  email: "",
  phone: "",
  rollNumber: "",
  classId: "",
  section: ""
};

const Students = () => {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState(emptyStudentForm);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentData, classData] = await Promise.all([
        getStudents(),
        getClasses()
      ]);

      setStudents(studentData.students || []);
      setClasses(classData.classes || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load students. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const classNameById = useMemo(() => {
    return classes.reduce((map, classItem) => {
      map[classItem.id] = `${classItem.className} - ${classItem.section}`;
      return map;
    }, {});
  }, [classes]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.fullName?.toLowerCase().includes(term) ||
        student.rollNumber?.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term)
      );
    });
  }, [students, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedStudent(null);
    setFormData(emptyStudentForm);
    setError("");
  };

  const openEditModal = (student) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId || "",
      fullName: student.fullName || "",
      email: student.email || "",
      phone: student.phone || "",
      rollNumber: student.rollNumber || "",
      classId: student.classId || "",
      section: student.section || ""
    });
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedStudent(null);
    setFormData(emptyStudentForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "classId") {
      const selectedClass = classes.find((classItem) => classItem.id === value);
      setFormData((current) => ({
        ...current,
        classId: value,
        section: selectedClass?.section || current.section
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (modalMode === "edit" && selectedStudent) {
        await updateStudent(selectedStudent.id, formData);
      } else {
        await createStudent(formData);
      }

      closeModal();
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save student. Please check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Deactivate ${student.fullName}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteStudent(student.id);
      setSuccess(`${student.fullName} deactivated.`);
      setTimeout(() => setSuccess(""), 4000);
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to deactivate student.");
    }
  };

  const parseCsv = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || "";
      });
      const classMatch = classes.find(
        (c) => `${c.className} - ${c.section}`.toLowerCase() === (row.class || "").toLowerCase()
          || c.className.toLowerCase() === (row.class || "").toLowerCase()
      );
      return {
        studentId: row.studentid || row.id || "",
        fullName: row.fullname || row.name || "",
        email: row.email || "",
        phone: row.phone || "",
        rollNumber: row.rollnumber || row.roll || "",
        classId: classMatch?.id || row.classid || "",
        section: row.section || classMatch?.section || ""
      };
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setError("");
    setSuccess("");

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        setError("CSV is empty or has no data rows. Expected header: studentId, fullName, email, phone, rollNumber, class, section");
        return;
      }
      const result = await bulkImportStudents(rows);
      setImportResult(result);
      if (result.summary?.imported > 0) {
        setSuccess(`Imported ${result.summary.imported} students.`);
        setTimeout(() => setSuccess(""), 5000);
        await loadData();
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Import failed. Check the CSV format and try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Student records</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Students Management</h1>
            <p className="mt-2 text-sm text-brand-muted">Manage enrolled students and face registration readiness. CSV columns: studentId, fullName, email, phone, rollNumber, class, section.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-brand-primary/50 disabled:opacity-60"
            >
              <FiUpload />
              {importing ? "Importing..." : "Import CSV"}
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-bold text-white shadow-glow"
            >
              <FiPlus />
              Add Student
            </button>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:max-w-md">
              <FiSearch className="text-brand-muted" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, roll number, student ID..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
              />
            </div>
            <p className="text-sm font-semibold text-brand-muted">{filteredStudents.length} students shown</p>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-100">
              {success}
            </div>
          )}

          {importResult && importResult.summary?.failed > 0 && (
            <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
              <p className="text-sm font-bold text-amber-100">
                {importResult.summary.failed} rows failed:
              </p>
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-amber-100/80">
                {(importResult.errors || []).slice(0, 20).map((e, i) => (
                  <li key={i}>Row {e.row}: {e.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Roll</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Section</th>
                    <th className="px-5 py-4">Face</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading && Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5" colSpan="7">
                        <div className="h-5 animate-pulse rounded-full bg-white/10" />
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredStudents.map((student) => (
                    <tr key={student.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{student.fullName}</p>
                        <p className="mt-1 text-xs text-brand-muted">{student.studentId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white">{student.email || "No email"}</p>
                        <p className="mt-1 text-xs text-brand-muted">{student.phone || "No phone"}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-white">{student.rollNumber}</td>
                      <td className="px-5 py-4 text-sm text-brand-muted">{classNameById[student.classId] || student.classId || "Unassigned"}</td>
                      <td className="px-5 py-4 text-sm text-white">{student.section || "-"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                          student.faceRegistered ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-brand-muted"
                        }`}>
                          <FiUserCheck />
                          {student.faceRegistered ? "Registered" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(student)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white"
                            aria-label="Edit student"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-muted transition hover:border-red-400/50 hover:text-red-200"
                            aria-label="Deactivate student"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredStudents.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-white">No students found</p>
                <p className="mt-2 text-sm text-brand-muted">Add a student or adjust your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-md">
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel w-full max-w-2xl rounded-[2rem] p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">{modalMode === "edit" ? "Edit" : "Add"} student</p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">{modalMode === "edit" ? "Update student record" : "Create student record"}</h2>
              </div>
              <button type="button" onClick={closeModal} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-brand-muted hover:text-white">
                <FiX />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["studentId", "Student ID", "STU-001"],
                ["fullName", "Full name", "Ali Khan"],
                ["email", "Email", "ali@example.com"],
                ["phone", "Phone", "03000000000"],
                ["rollNumber", "Roll number", "01"],
                ["section", "Section", "A"]
              ].map(([name, label, placeholder]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={["studentId", "fullName", "rollNumber"].includes(name)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-brand-muted focus:border-brand-primary/70"
                  />
                </label>
              ))}

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-white">Class</span>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70"
                >
                  <option value="">Select class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.className} - {classItem.section}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-sm font-bold text-white shadow-glow transition disabled:opacity-70"
            >
              {saving ? "Saving..." : modalMode === "edit" ? "Update Student" : "Add Student"}
            </button>
          </motion.form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Students;
