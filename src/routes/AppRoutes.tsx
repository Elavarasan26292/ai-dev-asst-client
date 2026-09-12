import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const LoginPage = lazy(() => import("../modules/auth/pages/LoginPage"));
const DashboardPage = lazy(
  () => import("../modules/dashboard/pages/DashboardPage")
);
const StartDevelopmentPage = lazy(
  () => import("../modules/start-development/pages/StartDevelopmentPage")
);
const TasksCompletedPage = lazy(
  () => import("../modules/tasks-completed/pages/TasksCompletedPage")
);
const UsersPage = lazy(() => import("../modules/users/pages/UsersPage"));
const RolesPage = lazy(() => import("../modules/roles/pages/RolesPage"));
const AccountPage = lazy(() => import("../modules/account/pages/AccountPage"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid var(--color-primary)",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-development"
          element={
            <ProtectedRoute>
              <StartDevelopmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks-completed"
          element={
            <ProtectedRoute>
              <TasksCompletedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
