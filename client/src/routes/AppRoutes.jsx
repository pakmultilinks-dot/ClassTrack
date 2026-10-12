import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import AccessDenied from "../pages/AccessDenied";
import About from "../pages/About";
import AttendanceScan from "../pages/AttendanceScan";
import Classes from "../pages/Classes";
import Dashboard from "../pages/Dashboard";
import FaceRegistration from "../pages/FaceRegistration";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ManualAttendance from "../pages/ManualAttendance";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Students from "../pages/Students";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import NotFound from "../pages/NotFound";

const RoleDashboard = () => {
  const { user } = useAuth();

  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  }

  if (user?.role === "student") {
    return <StudentDashboard />;
  }

  return <Dashboard />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <RoleDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/students"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Students />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/classes"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Classes />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/face-registration"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <FaceRegistration />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/attendance-scan"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <AttendanceScan />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/manual-attendance"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <ManualAttendance />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/reports"
        element={(
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Reports />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/my-attendance"
        element={(
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/profile"
        element={(
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/settings"
        element={(
          <ProtectedRoute allowedRoles={["admin"]}>
            <Settings />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/access-denied"
        element={(
          <ProtectedRoute>
            <AccessDenied />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
