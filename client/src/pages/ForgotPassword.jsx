import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout
      badge="Account recovery"
      title="Reset your password"
      subtitle="Enter your email and we will prepare a reset flow for your account."
    >
      <form className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-sm font-semibold leading-6 text-brand-muted">
            Password reset is currently only available through your system administrator. Please contact your IT helpdesk or school administration to reset your credentials.
          </p>
        </div>

        <Link
          to="/login"
          className="mx-auto flex w-fit items-center gap-2 text-sm font-semibold text-[#C8D2FF] transition hover:text-white"
        >
          <FiArrowLeft />
          Back to login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
