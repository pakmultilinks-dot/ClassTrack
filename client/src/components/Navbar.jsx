import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#stats" },
  { label: "Contact", href: "#contact" }
];

const Navbar = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/78 px-4 py-3 shadow-soft backdrop-blur-2xl sm:px-6"
      >
        <a href="#home" className="flex items-center gap-3">
          <Logo size={40} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-muted transition duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark transition duration-300 hover:bg-[#E9EAFF] sm:px-5"
          >
            Login
            <FiArrowRight className="transition duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
