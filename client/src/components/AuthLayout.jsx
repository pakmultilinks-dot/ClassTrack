import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiActivity, FiCheckCircle, FiShield } from "react-icons/fi";
import Logo from "./Logo";

const trustItems = [
  { label: "Secure identity workflows", icon: FiShield },
  { label: "Fast attendance operations", icon: FiActivity },
  { label: "Built for institutions", icon: FiCheckCircle }
];

const AuthLayout = ({ badge, title, subtitle, children }) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-dark px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-brand-radial" />
      <motion.div
        animate={{ opacity: [0.16, 0.32, 0.16], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-10 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-primary/30 blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.12, 0.26, 0.12], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-0 -z-10 h-80 w-80 rounded-full bg-brand-secondary/20 blur-3xl"
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Link to="/">
            <Logo size={44} />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary/50 hover:text-white"
          >
            Back home
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden max-w-2xl lg:block"
          >
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#C8D2FF] backdrop-blur-xl">
              AI-powered attendance intelligence
            </p>
            <h1 className="mt-7 text-6xl font-extrabold leading-tight tracking-normal">
              A premium control layer for modern campuses.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-muted">
              Sign in flows designed for administrators, teachers, and students before the dashboard arrives.
            </p>

            <div className="mt-10 grid gap-4">
              {trustItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.12, duration: 0.5 }}
                    className="glass-panel flex items-center gap-4 rounded-3xl p-4"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brand-primary">
                      <Icon size={22} />
                    </span>
                    <span className="font-semibold text-white">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: "easeOut" }}
            className="premium-border mx-auto w-full max-w-xl rounded-[2rem]"
          >
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-8 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.26em] text-brand-primary">
                  {badge}
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-brand-muted sm:text-base">{subtitle}</p>
              </div>
              {children}
            </div>
          </motion.section>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
