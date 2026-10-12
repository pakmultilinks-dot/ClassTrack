import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import AuthLayout from "../components/AuthLayout";

const NotFound = () => {
  return (
    <AuthLayout
      badge="404"
      title="Page not found"
      subtitle="The page you are looking for does not exist or was moved."
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-7xl font-extrabold text-white/20">404</p>
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-bold text-white shadow-glow"
          >
            <FiHome /> Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-brand-primary/50"
          >
            <FiArrowLeft /> Dashboard
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default NotFound;
