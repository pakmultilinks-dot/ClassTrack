import { FiAlertTriangle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import StudentStatusSelector from "./StudentStatusSelector";

const resultStyles = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  duplicate: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  error: "border-red-400/30 bg-red-500/10 text-red-100",
  idle: "border-white/10 bg-white/5 text-brand-muted"
};

const ResultBadge = ({ result }) => {
  if (!result) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${resultStyles.idle}`}>
        <FiClock />
        Not saved
      </span>
    );
  }

  const Icon = result.type === "success" ? FiCheckCircle : result.type === "duplicate" ? FiAlertTriangle : FiXCircle;

  return (
    <span className={`inline-flex max-w-xs items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${resultStyles[result.type] || resultStyles.error}`}>
      <Icon />
      {result.message}
    </span>
  );
};

const ManualAttendanceTable = ({
  loading,
  onStatusChange,
  results,
  saving,
  students,
  statuses
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-brand-muted">
            <tr>
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Roll</th>
              <th className="px-5 py-4">Section</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Save Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5" colSpan="6">
                  <div className="h-5 animate-pulse rounded-full bg-white/10" />
                </td>
              </tr>
            ))}

            {!loading && students.map((student) => (
              <tr key={student.id} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4">
                  <p className="font-bold text-white">{student.fullName}</p>
                  <p className="mt-1 text-xs text-brand-muted">{student.studentId}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white">{student.email || "No email"}</p>
                  <p className="mt-1 text-xs text-brand-muted">{student.phone || "No phone"}</p>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-white">{student.rollNumber || "-"}</td>
                <td className="px-5 py-4 text-sm text-brand-muted">{student.section || "-"}</td>
                <td className="px-5 py-4">
                  <StudentStatusSelector
                    disabled={saving}
                    value={statuses[student.id] || ""}
                    onChange={(status) => onStatusChange(student.id, status)}
                  />
                </td>
                <td className="px-5 py-4">
                  <ResultBadge result={results[student.id]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && students.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-lg font-bold text-white">No students found</p>
          <p className="mt-2 text-sm text-brand-muted">Select a class with active students to mark attendance.</p>
        </div>
      )}
    </div>
  );
};

export default ManualAttendanceTable;
