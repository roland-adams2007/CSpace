import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token || token.trim() === "") {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}
