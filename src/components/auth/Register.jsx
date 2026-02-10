import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Layers } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useAuth } from "./../../context/Auth/UseAuth";
import regImg from "./../../assets/auth/reg.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "./../../context/Alert/UseAlert";
const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!fname) newErrors.fname = "First name is required";
    if (!lname) newErrors.lname = "Last name is required";
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
      const response = await axiosInstance.post("/users/register", {
        fname,
        lname,
        email,
        password,
      });
      const res = response.data;
      if (res.status != 200) {
        setErrors({ submit: res.message || "Failed to register" });
      } else {
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");
        showAlert(res.message || "Registeration successful", "success");
        navigate("/login");
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      <div className="lg:hidden bg-white border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                CreatorSpace
              </h1>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md mx-auto fade-in">
          <div className="text-center mb-6 lg:hidden">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Join our community of creators
            </p>
          </div>

          <div className="login-card bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="mb-6">
              <div className="hidden lg:flex items-center space-x-3 mb-6">
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

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hidden lg:block">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Fill in your details to get started
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fname"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <div className="input-group relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fname"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                        autoComplete="given-name"
                      />
                    </div>
                    {errors.fname && (
                      <div className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.fname}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lname"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <div className="input-group relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lname"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                        autoComplete="family-name"
                      />
                    </div>
                    {errors.lname && (
                      <div className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.lname}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="input-group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="input-group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                      autoComplete="new-password"
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
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.password}
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="text-xs sm:text-sm text-red-600 text-center py-2">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-4 rounded-lg text-white font-semibold text-sm sm:text-base relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>

            <div className="text-center pt-4 sm:pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-xs sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-4 sm:mt-6">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500">
              <Link
                to="/terms"
                className="hover:text-gray-700 transition-colors hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="hover:text-gray-700 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/support"
                className="hover:text-gray-700 transition-colors hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 z-10"></div>
        <div className="relative w-full h-full flex items-center justify-center p-8 xl:p-12">
          <div className="max-w-2xl mx-auto">
            <img
              src={regImg}
              alt="Team collaboration"
              className="w-full h-auto max-h-[600px] object-contain fade-in"
            />
            <div className="mt-8 text-center">
              <h3 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-3">
                Start Your Creative Journey
              </h3>
              <p className="text-gray-600 text-lg xl:text-xl">
                Join thousands of creators who build, manage, and grow their
                online presence
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        @media (min-width: 640px) {
          .login-card {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          }
          .login-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
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
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
