import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, X, Layers } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useAuth } from "./../../context/Auth/UseAuth";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setRemember(false);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
        remember,
      });
      const res = response.data;
      login(res.data.user, res.data.token);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegisterClick = () => {
    onClose();
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    navigate("/forgot-password");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[1000] flex items-center justify-center md:p-4">
        <div className="relative w-full max-w-md mx-auto">
          <div className="login-modal bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            <div className="relative p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      CreatorSpace
                    </h1>
                    <p className="text-xs text-gray-500">Workspace</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mt-2">
                  Sign in to access your workspace and projects
                </p>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="modal-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="input-group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="modal-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="modal-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="input-group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="modal-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="modal-remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="modal-remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember this device
                  </label>
                </div>

                {errors.submit && (
                  <div className="text-sm text-red-600 text-center py-2 bg-red-50 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-4 rounded-lg text-white font-semibold text-base relative disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="text-center pt-6 border-t border-gray-100 mt-6">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <button
                  onClick={() => {
                    console.log("Terms clicked");
                    onClose();
                  }}
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => {
                    console.log("Privacy clicked");
                    onClose();
                  }}
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => {
                    console.log("Support clicked");
                    onClose();
                  }}
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-modal {
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .input-group {
          transition: all 0.2s ease;
        }
        .input-group:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          transition: all 0.3s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }
        .btn-primary:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default LoginModal;
