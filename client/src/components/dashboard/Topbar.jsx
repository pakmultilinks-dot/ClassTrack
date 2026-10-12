import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Dashboard` : "Dashboard";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-brand-dark/70 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:left-72 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-11 w-11 flex-none place-items-center rounded-full border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-muted">{roleLabel}</p>
            <h1 className="truncate text-xl font-bold text-white sm:text-2xl">
              Welcome back, {user?.fullName || "ClassTrack User"}
            </h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
            <FiSearch className="text-brand-muted" />
            <span className="text-sm text-brand-muted">Search students, classes, reports...</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-brand-muted transition hover:border-brand-primary/50 hover:text-white"
            aria-label="Notifications"
          >
            <FiBell />
          </button>
          <Link to="/profile" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 transition hover:border-brand-primary/50">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-bold">
              {user?.fullName?.charAt(0) || "A"}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-4 text-white">{user?.fullName || "Admin User"}</p>
              <p className="text-xs capitalize text-brand-muted">{user?.role || "admin"}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
