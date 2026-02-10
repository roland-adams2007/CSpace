import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layers } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setVerificationStatus("error");
        setMessage("Verification token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/users/verify", {
          token,
        });

        if (response.data && response.data.status === 200) {
          setVerificationStatus("success");
          setMessage(response.data.message || "Email verified successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setVerificationStatus("error");
          setMessage(response.data?.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The token may be expired or invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="lg:hidden bg-white border-b border-gray-100 rounded-t-xl">
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

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg">
          <div className="hidden lg:flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">CreatorSpace</h1>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verification
            </h2>
            <p className="text-gray-600 mb-8">
              {loading
                ? "Verifying your email..."
                : "We're verifying your email address"}
            </p>

            <div className="flex justify-center mb-6">
              {loading ? (
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
              ) : verificationStatus === "success" ? (
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              )}
            </div>

            <div className="mb-8">
              {loading ? (
                <p className="text-gray-700">
                  Please wait while we verify your email...
                </p>
              ) : (
                <>
                  <p
                    className={`text-lg font-medium mb-2 ${
                      verificationStatus === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {verificationStatus === "success"
                      ? "Verification Successful!"
                      : "Verification Failed"}
                  </p>
                  <p className="text-gray-600">{message}</p>
                </>
              )}
            </div>

            <div className="space-y-3">
              {verificationStatus === "success" && (
                <p className="text-sm text-gray-500">
                  Redirecting to login page in 3 seconds...
                </p>
              )}

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go to Login
              </button>

              {verificationStatus === "error" && (
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Register Again
                </button>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <a
                  href="/support"
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Contact Support
                </a>
                <a
                  href="/privacy"
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="hover:text-gray-700 transition-colors hover:underline"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;