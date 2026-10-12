import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Welcome back"
      title="Login to ClassTrack"
      subtitle="Enter your credentials to continue."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">Email address</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
            <FiMail className="text-brand-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@classtrack.com"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">Password</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
            <FiLock className="text-brand-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-brand-muted hover:text-white transition focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-xs font-semibold leading-relaxed text-brand-muted">
            Only registered users can access this system. Role assignments (Admin, Teacher, Student) are automatically detected upon login.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-[#C8D2FF] transition hover:text-white cursor-pointer">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
          <FiArrowRight />
        </motion.button>

        <p className="text-center text-sm text-brand-muted">
          New to ClassTrack?{" "}
          <Link to="/register" className="font-semibold text-white transition hover:text-[#C8D2FF]">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
