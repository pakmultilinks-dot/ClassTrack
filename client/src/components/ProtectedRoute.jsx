import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../pages/AccessDenied";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-dark px-4 text-white">
        <div className="glass-panel rounded-3xl px-6 py-5 text-center">
          <p className="text-sm font-semibold text-brand-muted">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
