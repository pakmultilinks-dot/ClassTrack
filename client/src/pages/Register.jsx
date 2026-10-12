import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const roles = ["Admin", "Teacher", "Student"];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Create access"
      title="Register for ClassTrack"
      subtitle="Set up a clean account experience before the platform dashboard launches."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">Full name</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
            <FiUser className="text-brand-muted" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ali Khan"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">Email address</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
            <FiMail className="text-brand-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@classtrack.com"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
            />
          </div>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
              <FiLock className="text-brand-muted" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Confirm</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-brand-primary/70 focus-within:bg-white/8">
              <FiLock className="text-brand-muted" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm"
                required
                minLength={6}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
              />
            </div>
          </label>
        </div>

        <div>
          <span className="mb-3 block text-sm font-semibold text-white">Register as</span>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <label
                key={role}
                className={`cursor-pointer rounded-2xl border px-3 py-3 text-center text-sm font-semibold transition hover:border-brand-primary/60 hover:text-white ${
                  formData.role === role.toLowerCase()
                    ? "border-brand-primary/70 bg-brand-primary/15 text-white"
                    : "border-white/10 bg-white/5 text-brand-muted"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.toLowerCase()}
                  checked={formData.role === role.toLowerCase()}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
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
          {isSubmitting ? "Creating account..." : "Register"}
          <FiArrowRight />
        </motion.button>

        <p className="text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-white transition hover:text-[#C8D2FF]">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
