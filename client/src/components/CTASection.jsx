import { motion } from "framer-motion";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";

const CTASection = () => {
  return (
    <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="premium-border relative mx-auto max-w-7xl rounded-[2rem]"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] px-6 py-16 text-center shadow-soft sm:px-10 lg:px-20">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-brand-primary/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-secondary/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">
              Built for modern campuses
            </p>
            <h2 className="mt-5 text-4xl font-extrabold tracking-normal text-white sm:text-6xl">
              Start Managing Attendance Smarter
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Bring identity, attendance, reporting, and student visibility into one refined system.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#home"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-brand-dark"
              >
                Launch Platform
                <FiArrowRight />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="mailto:hello@classtrack.local"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl"
              >
                <FiMessageCircle />
                Contact Team
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
