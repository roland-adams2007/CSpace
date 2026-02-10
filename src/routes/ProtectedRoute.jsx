import { Navigate, Outlet, useNavigate } from "react-router-dom";
import WebsiteSelect from "../components/website/WebsiteSelect";
import { useState, useEffect } from "react";
import AppLoader from "../components/ui/loaders/AppLoader";
import LoginModal from "../components/auth/LoginModal";
import { useAuth } from "../context/Auth/UseAuth";

export default function ProtectedRoute() {
  const [showWebsiteSelect, setShowWebsiteSelect] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    if (loadingUser) return;

    if (!user) {
      setShowLoginModal(true);
      setIsCheckingAuth(false);
      return;
    }

    const selectedWebsite = localStorage.getItem("selectedWebsite");

    if (!selectedWebsite) {
      setShowWebsiteSelect(true);
    }

    setIsCheckingAuth(false);
  }, [user, loadingUser]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    const selectedWebsite = localStorage.getItem("selectedWebsite");
    if (!selectedWebsite) {
      setShowWebsiteSelect(true);
    }
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleSwitchToRegister = () => {
    handleCloseLoginModal();
    navigate("/reg");
  };

  if (isCheckingAuth || loadingUser) {
    return <AppLoader />;
  }
if (showWebsiteSelect) {
  return <WebsiteSelect onDone={() => setShowWebsiteSelect(false)} />;
}


  if (!user) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  return <Outlet />;
}
