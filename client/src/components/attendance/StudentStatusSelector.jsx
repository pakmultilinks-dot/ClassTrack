const statusOptions = [
  { label: "Present", value: "present", activeClass: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30" },
  { label: "Absent", value: "absent", activeClass: "bg-red-500/20 text-red-100 ring-1 ring-red-400/30" },
  { label: "Late", value: "late", activeClass: "bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/30" }
];

const StudentStatusSelector = ({ disabled = false, onChange, value }) => {
  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition disabled:cursor-not-allowed disabled:opacity-60 ${
            value === option.value
              ? option.activeClass
              : "text-brand-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StudentStatusSelector;
