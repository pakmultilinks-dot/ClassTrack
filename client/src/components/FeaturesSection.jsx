import { motion } from "framer-motion";
import {
  FiActivity,
  FiBarChart2,
  FiClock,
  FiEye,
  FiLayers,
  FiUsers
} from "react-icons/fi";

const features = [
  {
    title: "Face Recognition Attendance",
    description: "Capture verified attendance with fast descriptor-based recognition flows.",
    icon: FiEye
  },
  {
    title: "Smart Reports",
    description: "Turn daily records into clean summaries, trends, and attendance insights.",
    icon: FiBarChart2
  },
  {
    title: "Real-time Analytics",
    description: "Monitor class attendance patterns with crisp, decision-ready metrics.",
    icon: FiActivity
  },
  {
    title: "Teacher Dashboard",
    description: "Give teachers a focused command center for classes, students, and sessions.",
    icon: FiLayers
  },
  {
    title: "Student Tracking",
    description: "Keep student profiles, class sections, and attendance status organized.",
    icon: FiUsers
  },
  {
    title: "Attendance History",
    description: "Review past attendance records by student, class, subject, and date.",
    icon: FiClock
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.55, ease: "easeOut" }
  })
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-20 -z-10 mx-auto h-96 max-w-4xl rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">
            Precision toolkit
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-normal text-white sm:text-5xl">
            Everything institutions need to modernize attendance.
          </h2>
          <p className="mt-5 text-lg leading-8 text-brand-muted">
            Designed for daily academic operations with polished workflows and reliable structure.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group glass-panel rounded-3xl p-7 transition duration-300 hover:border-brand-primary/45 hover:shadow-glow"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary/25 to-brand-secondary/20 text-white ring-1 ring-white/10 transition duration-300 group-hover:scale-105">
                  <Icon size={24} />
                </div>
                <h3 className="mt-7 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-brand-muted">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
