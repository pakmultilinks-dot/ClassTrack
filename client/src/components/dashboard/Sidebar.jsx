import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiCamera,
  FiClipboard,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiShield,
  FiUser,
  FiUserCheck,
  FiX,
  FiUsers
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";

const links = [
  { label: "Dashboard", icon: FiGrid, to: "/dashboard", roles: ["admin", "teacher", "student"] },
  { label: "Students", icon: FiUsers, to: "/students", roles: ["admin", "teacher"] },
  { label: "Classes", icon: FiShield, to: "/classes", roles: ["admin", "teacher"] },
  { label: "Face Registration", icon: FiCamera, to: "/face-registration", roles: ["admin", "teacher"] },
  { label: "Attendance Scan", icon: FiCamera, to: "/attendance-scan", roles: ["admin", "teacher"] },
  { label: "Manual Attendance", icon: FiClipboard, to: "/manual-attendance", roles: ["admin", "teacher"] },
  { label: "Reports", icon: FiBarChart2, to: "/reports", roles: ["admin", "teacher"] },
  { label: "My Attendance", icon: FiUserCheck, to: "/my-attendance", roles: ["student"] },
  { label: "Profile", icon: FiUser, to: "/profile", roles: ["student"] },
  { label: "Settings", icon: FiSettings, to: "/settings", roles: ["admin"] }
];

const Sidebar = ({ isOpen = false, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const visibleLinks = links.filter((link) => link.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-black/35 p-4 backdrop-blur-2xl transition-transform duration-300 lg:z-40 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="flex h-full flex-col rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center justify-between gap-3 px-2 py-3">
          <div className="flex items-center gap-3">
            <Logo size={44} showWordmark={false} />
            <div>
              <p className="font-display text-lg font-bold text-white">ClassTrack</p>
              <p className="text-xs font-medium capitalize text-brand-muted">{user?.role || "user"} Control</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-brand-muted hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {visibleLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive && (link.label === "Dashboard" || link.to !== "/dashboard")
                    ? "bg-gradient-to-r from-brand-primary/25 to-brand-secondary/15 text-white ring-1 ring-brand-primary/30"
                    : "text-brand-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-brand-muted transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-white"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
