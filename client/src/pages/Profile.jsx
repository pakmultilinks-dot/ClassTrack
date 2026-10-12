import { useNavigate } from "react-router-dom";
import { FiCalendar, FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  return new Date(dateValue).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

const Profile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="premium-border rounded-[2rem]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] p-6 shadow-soft sm:p-8">
            <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary text-2xl font-extrabold text-white shadow-glow">
                  {user?.fullName?.charAt(0) || "U"}
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-primary">Profile</p>
                  <h1 className="mt-2 text-3xl font-extrabold text-white">{user?.fullName || "ClassTrack User"}</h1>
                  <p className="mt-1 text-sm capitalize text-brand-muted">{user?.role || "user"} account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/15"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Full Name", user?.fullName || "Not available", FiUser],
            ["Email", user?.email || "Not available", FiMail],
            ["Role", user?.role || "user", FiShield],
            ["Joined", formatDate(user?.createdAt), FiCalendar]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass-panel rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-muted">{label}</p>
                  <p className="mt-3 truncate text-lg font-extrabold capitalize text-white">{value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                  <Icon />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Account status</p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">Active Session</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Your account is active and authenticated with the ClassTrack backend.
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-extrabold text-emerald-200">
              Active
            </span>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
