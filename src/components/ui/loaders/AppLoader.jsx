import React from "react";
import { Loader2 } from "lucide-react";

const AppLoader = ({ message = "Loading your files..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" />

      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          CreatorSpace
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2">{message}</p>
        <p className="text-xs text-gray-500">Workspace</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AppLoader;
