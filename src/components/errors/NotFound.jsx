import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Layers } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg font-semibold text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Need help?{" "}
              <Link
                to="/support"
                className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;