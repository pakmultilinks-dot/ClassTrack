import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiEdit3, FiPlus, FiSearch, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { createClass, deleteClass, getClasses, updateClass } from "../services/classService";
import { getTeachers } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const emptyClassForm = {
  className: "",
  section: "",
  teacherId: "",
  subjects: ""
};

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState(emptyClassForm);
  const [teachers, setTeachers] = useState([]);
  const [teacherMap, setTeacherMap] = useState({});

  const loadClasses = async () => {
    setLoading(true);
    setError("");

    try {
      const [classData, teacherData] = await Promise.all([
        getClasses(),
        user?.role === "admin" ? getTeachers().catch(() => ({ teachers: [] })) : Promise.resolve({ teachers: [] })
      ]);
      setClasses(classData.classes || []);
      const list = teacherData.teachers || [];
      setTeachers(list);
      setTeacherMap(list.reduce((m, t) => ({ ...m, [t.id]: t.fullName }), {}));
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load classes. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return classes;
    }

    return classes.filter((classItem) => {
      return (
        classItem.className?.toLowerCase().includes(term) ||
        classItem.section?.toLowerCase().includes(term)
      );
    });
  }, [classes, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedClass(null);
    setFormData({
      ...emptyClassForm,
      teacherId: user?.id || ""
    });
    setError("");
  };

  const openEditModal = (classItem) => {
    setModalMode("edit");
    setSelectedClass(classItem);
    setFormData({
      className: classItem.className || "",
      section: classItem.section || "",
      teacherId: classItem.teacherId || "",
      subjects: Array.isArray(classItem.subjects) ? classItem.subjects.join(", ") : ""
    });
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedClass(null);
    setFormData(emptyClassForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const toPayload = () => ({
    className: formData.className,
    section: formData.section,
    teacherId: formData.teacherId,
    subjects: formData.subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean)
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (modalMode === "edit" && selectedClass) {
        await updateClass(selectedClass.id, toPayload());
      } else {
        await createClass(toPayload());
      }

      closeModal();
      await loadClasses();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save class. Please check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (classItem) => {
    const confirmed = window.confirm(`Deactivate ${classItem.className} - ${classItem.section}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteClass(classItem.id);
      await loadClasses();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to deactivate class.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Academic structure</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Classes Management</h1>
            <p className="mt-2 text-sm text-brand-muted">Create, organize, and manage class sections and subjects.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-bold text-white shadow-glow"
          >
            <FiPlus />
            Create Class
          </button>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:max-w-md">
              <FiSearch className="text-brand-muted" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search class name or section..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
              />
            </div>
            <p className="text-sm font-semibold text-brand-muted">{filteredClasses.length} classes shown</p>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {loading && Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="glass-panel rounded-3xl p-5">
                <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
                <div className="mt-4 h-4 w-28 animate-pulse rounded-full bg-white/10" />
                <div className="mt-8 h-20 animate-pulse rounded-3xl bg-white/10" />
              </div>
            ))}

            {!loading && filteredClasses.map((classItem) => (
              <motion.article
                key={classItem.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-panel rounded-3xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                        <FiBookOpen />
                      </span>
                      <div>
                        <h2 className="text-lg font-extrabold text-white">{classItem.className}</h2>
                        <p className="text-sm text-brand-muted">Section {classItem.section}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(classItem)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white"
                      aria-label="Edit class"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(classItem)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-muted transition hover:border-red-400/50 hover:text-red-200"
                      aria-label="Deactivate class"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-brand-muted">
                    <FiUsers />
                    <span>Teacher ID</span>
                  </div>
                  <p className="mt-2 break-all text-sm font-semibold text-white">{teacherMap[classItem.teacherId] || classItem.teacherName || "Not assigned"}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(classItem.subjects || []).length > 0 ? (
                    classItem.subjects.map((subject) => (
                      <span key={subject} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#C8D2FF]">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-brand-muted">No subjects added</span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {!loading && filteredClasses.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-lg font-bold text-white">No classes found</p>
              <p className="mt-2 text-sm text-brand-muted">Create a class or adjust your search.</p>
            </div>
          )}
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
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">{modalMode === "edit" ? "Edit" : "Add"} class</p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">{modalMode === "edit" ? "Update class record" : "Create class record"}</h2>
              </div>
              <button type="button" onClick={closeModal} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-brand-muted hover:text-white">
                <FiX />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Class name</span>
                <input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="BS Computer Science"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-brand-muted focus:border-brand-primary/70"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Section</span>
                <input
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="A"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-brand-muted focus:border-brand-primary/70"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-white">Teacher</span>
                {teachers.length > 0 ? (
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none focus:border-brand-primary/70"
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    placeholder="Teacher user ID"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-brand-muted focus:border-brand-primary/70"
                  />
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-white">Subjects</span>
                <input
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="English, Computer, Math"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-brand-muted focus:border-brand-primary/70"
                />
                <span className="mt-2 block text-xs text-brand-muted">Separate subjects with commas.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-sm font-bold text-white shadow-glow transition disabled:opacity-70"
            >
              {saving ? "Saving..." : modalMode === "edit" ? "Update Class" : "Create Class"}
            </button>
          </motion.form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Classes;
