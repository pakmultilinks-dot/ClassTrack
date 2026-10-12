import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiPlus, FiSearch, FiUsers } from "react-icons/fi";

const actions = [
  { label: "Add Student", icon: FiPlus, to: "/students" },
  { label: "Create Class", icon: FiUsers, to: "/classes" },
  { label: "Register Face", icon: FiCamera, to: "/face-registration" },
  { label: "Scan Attendance", icon: FiSearch, to: "/attendance-scan" }
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-muted">Quick actions</p>
          <h2 className="mt-1 text-xl font-bold text-white">Start common workflows</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.label}
              type="button"
              onClick={() => navigate(action.to)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm font-bold text-white transition hover:border-brand-primary/50 hover:bg-white/8"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-primary/15 text-brand-primary">
                <Icon />
              </span>
              {action.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
