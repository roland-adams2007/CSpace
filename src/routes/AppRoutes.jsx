import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFound from "../components/errors/NotFound";
import AppLoader from "../components/ui/loaders/AppLoader";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

// 🔹 Lazy imports (code-splitting only)
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const VerifyEmail = lazy(() => import("../components/auth/VerifyEmail"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/" element={<>Home</>} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reg" element={<Register />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
