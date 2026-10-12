import { motion } from "framer-motion";
import { FiPlay, FiZap } from "react-icons/fi";
import FloatingCards from "./FloatingCards";
import platformPreview from "../assets/platform-preview.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-4 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-brand-radial" />
      <motion.div
        animate={{ opacity: [0.18, 0.34, 0.18], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-primary/30 blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.14, 0.28, 0.14], x: [0, 28, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-brand-secondary/20 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-4xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#C8D2FF] backdrop-blur-xl lg:mx-0"
          >
            <FiZap className="text-brand-primary" />
            AI-powered Face Recognition Attendance System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.75 }}
            className="mt-7 text-5xl font-extrabold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl"
          >
            Next Generation{" "}
            <span className="text-gradient">Face Recognition Attendance System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.75 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-muted lg:mx-0"
          >
            Smart AI-powered attendance management for schools, colleges, and academies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.75 }}
            className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-7 py-4 text-sm font-bold text-white shadow-glow"
            >
              Get Started
              <FiZap />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/12"
            >
              <FiPlay />
              Watch Demo
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-2xl"
        >
          <FloatingCards />
          <div className="premium-border relative rounded-[2rem] p-2">
            <div className="glass-panel overflow-hidden rounded-[1.7rem]">
              <img
                src={platformPreview}
                alt="ClassTrack attendance analytics interface preview"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 h-px max-w-7xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
};

export default HeroSection;
