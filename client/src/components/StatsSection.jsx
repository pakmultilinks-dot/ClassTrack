import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { label: "Students", value: 10000, suffix: "K+", divisor: 1000 },
  { label: "Institutes", value: 500, suffix: "+", divisor: 1 },
  { label: "Accuracy", value: 99.9, suffix: "%", divisor: 1, decimals: 1 },
  { label: "Tracking", value: 24, suffix: "/7", divisor: 1 }
];

const Counter = ({ value, suffix, divisor = 1, decimals = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const displayValue = latest / divisor;
    return `${displayValue.toFixed(decimals)}${suffix}`;
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    const controls = animate(count, value, { duration: 1.9, ease: "easeOut" });
    return controls.stop;
  }, [count, isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const StatsSection = () => {
  return (
    <section id="stats" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              className="glass-panel rounded-3xl px-6 py-8 text-center"
            >
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  divisor={stat.divisor}
                  decimals={stat.decimals}
                />
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
