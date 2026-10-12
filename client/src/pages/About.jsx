import { FiGithub, FiLinkedin } from "react-icons/fi";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary font-extrabold text-2xl text-white">
            CT
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-white">About ClassTrack</h1>
            <p className="text-sm text-brand-muted">AI-Powered Face Recognition Attendance Intelligence</p>
          </div>
        </div>

        <p className="text-brand-muted leading-relaxed mb-6">
          ClassTrack is a state-of-the-art attendance management system designed for modern educational institutions.
          By replacing traditional roll calls with browser-side face descriptor generation and instant high-precision backend Euclidean matching, ClassTrack guarantees real-time accuracy and zero image privacy risk.
        </p>

        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xl font-bold text-white mb-4">Developer & Support</h2>
          <p className="text-sm text-brand-muted mb-4">
            Created and maintained by Malik Abdur Rehman. Connect on GitHub or LinkedIn for updates and contributions.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rehmantechx"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand-primary/60 hover:bg-white/10"
            >
              <FiGithub className="text-lg" />
              GitHub Profile
            </a>

            <a
              href="https://www.linkedin.com/in/malik-abdur-rehman-9b4228358/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand-primary/60 hover:bg-white/10"
            >
              <FiLinkedin className="text-lg" />
              LinkedIn Profile
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
