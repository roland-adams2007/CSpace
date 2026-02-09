import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFound from "../components/errors/NotFound";
import AppLoader from "../components/ui/loaders/AppLoader";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// 🔹 Lazy imports (code-splitting only)
const Login = lazy(() => import("../components/auth/Login"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/" element={<>Home</>} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes wrapper - redirects to login if not authenticated */}
        {/* Add your protected routes here when ready */}
        {/* 
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
