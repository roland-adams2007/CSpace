import { Navigate, Outlet } from "react-router-dom";
import WebsiteSelect from "../components/website/WebsiteSelect";
import { useState, useEffect } from "react";
import AppLoader from "../components/ui/loaders/AppLoader";

export default function ProtectedRoute() {
  const [showWebsiteSelect, setShowWebsiteSelect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const selectedWebsite = localStorage.getItem("selectedWebsite");

    if (!token || token.trim() === "") {
      return;
    }

    if (!selectedWebsite) {
      setShowWebsiteSelect(true);
    }
  }, []);

  const token = localStorage.getItem("accessToken");

  if (!token || token.trim() === "") {
    return <Navigate to="/login" replace />;
  }

  if (showWebsiteSelect) {
    return <WebsiteSelect />;
  }

  return <Outlet />;
}
