import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const AccessDenied = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="grid min-h-[calc(100vh-8rem)] place-items-center">
        <section className="premium-border w-full max-w-2xl rounded-[2rem]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#080B1D] p-8 text-center shadow-soft">
            <div className="absolute -right-10 top-0 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" />
            <div className="relative">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-500/15 text-red-100">
                <FiShield size={28} />
              </span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.28em] text-red-200">Access denied</p>
              <h1 className="mt-3 text-3xl font-extrabold text-white">This area is not available for your role.</h1>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brand-muted">
                You are signed in as {user?.role || "a user"}. Please return to your dashboard or use an account with the required permissions.
              </p>
              <Link
                to="/dashboard"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-bold text-white shadow-glow"
              >
                <FiArrowLeft />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AccessDenied;
