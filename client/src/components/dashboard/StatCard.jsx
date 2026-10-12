import { motion } from "framer-motion";

const StatCard = ({ title, value, trend, icon: Icon, accent = "from-brand-primary to-brand-secondary" }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-muted">{title}</p>
          <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
          <p className="mt-3 text-sm font-semibold text-emerald-300">{trend}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-glow`}>
          <Icon size={22} />
        </span>
      </div>
    </motion.article>
  );
};

export default StatCard;
