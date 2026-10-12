import { motion } from "framer-motion";
import { FiActivity, FiBarChart2, FiCheckCircle, FiPieChart } from "react-icons/fi";

const floatingCards = [
  {
    title: "Attendance Analytics",
    value: "96.4%",
    icon: FiBarChart2,
    className: "left-2 top-10 md:-left-6 md:top-16",
    delay: 0
  },
  {
    title: "Face Scan Success",
    value: "0.8s",
    icon: FiCheckCircle,
    className: "right-0 top-24 md:-right-8 md:top-24",
    delay: 0.18
  },
  {
    title: "Student Statistics",
    value: "10K+",
    icon: FiPieChart,
    className: "bottom-8 left-4 md:-left-10 md:bottom-14",
    delay: 0.34
  },
  {
    title: "Smart Reports",
    value: "Live",
    icon: FiActivity,
    className: "bottom-2 right-4 md:right-8 md:bottom-4",
    delay: 0.5
  }
];

const FloatingCards = () => {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {floatingCards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
            transition={{
              opacity: { delay: card.delay, duration: 0.55 },
              scale: { delay: card.delay, duration: 0.55 },
              y: { delay: card.delay, duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`glass-panel absolute w-56 rounded-3xl p-4 ${card.className}`}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-brand-primary">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs font-medium text-brand-muted">{card.title}</p>
                <p className="mt-1 text-xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingCards;
