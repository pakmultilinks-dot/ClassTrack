import { FiBookOpen, FiLayers, FiSliders } from "react-icons/fi";

const AttendanceControls = ({
  classes,
  loading,
  selectedClassId,
  selectedSubject,
  subjects,
  onClassChange,
  onSubjectChange
}) => {
  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow">
          <FiSliders />
        </span>
        <div>
          <p className="text-lg font-extrabold text-white">Scan Controls</p>
          <p className="text-sm text-brand-muted">Choose the class and subject before marking attendance.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <FiLayers />
            Class
          </span>
          <select
            value={selectedClassId}
            onChange={(event) => onClassChange(event.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary/70 disabled:opacity-70"
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
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <FiBookOpen />
            Subject
          </span>
          <select
            value={selectedSubject}
            onChange={(event) => onSubjectChange(event.target.value)}
            disabled={!selectedClassId || subjects.length === 0}
            className="w-full rounded-2xl border border-white/10 bg-[#10172A] px-4 py-3 text-sm text-white outline-none transition focus:border-brand-primary/70 disabled:opacity-70"
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
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Class", selectedClassId ? "Selected" : "Required"],
          ["Subject", selectedSubject ? "Selected" : "Required"],
          ["Camera", selectedClassId && selectedSubject ? "Ready" : "Locked"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">{label}</p>
            <p className="mt-2 text-sm font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceControls;
