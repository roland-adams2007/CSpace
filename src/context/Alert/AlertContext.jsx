import { createContext, useState, useCallback, useEffect, useRef } from "react";

const AlertContext = createContext();

const alertConfig = {
  success: {
    bg: "bg-green-600",
    text: "text-white",
    icon: "text-white",
    button: "text-white hover:bg-white/20",
    progress: "bg-white",
  },
  error: {
    bg: "bg-red-600",
    text: "text-white",
    icon: "text-white",
    button: "text-white hover:bg-white/20",
    progress: "bg-white",
  },
  warning: {
    bg: "bg-yellow-500",
    text: "text-black",
    icon: "text-black",
    button: "text-black hover:bg-black/10",
    progress: "bg-black",
  },
  info: {
    bg: "bg-blue-600",
    text: "text-white",
    icon: "text-white",
    button: "text-white hover:bg-white/20",
    progress: "bg-white",
  },
};

const IconSuccess = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const IconError = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const iconMap = {
  success: IconSuccess,
  error: IconError,
  warning: IconWarning,
  info: IconInfo,
};

const ProgressBar = ({ duration, config }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden">
      <div
        className={`h-full ${config.progress} opacity-70`}
        style={{
          width: '100%',
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

const Alert = ({ alert, onClose, duration }) => {
  const config = alertConfig[alert.type] || alertConfig.info;
  const IconComponent = iconMap[alert.type] || iconMap.info;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutLeft {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
      @keyframes slideInDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideOutUp {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="fixed md:bottom-6 md:left-6 md:top-auto md:right-auto top-0 left-0 right-0 z-[9999] flex md:block justify-center"
      style={{
        animation: "slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        className={`
          relative w-full md:w-96 mx-4 md:mx-0 mt-4 md:mt-0
          ${config.bg}
          shadow-2xl
        `}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`flex-shrink-0 ${config.icon}`}>
                <IconComponent />
              </div>
              <p className={`text-base font-bold ${config.text} tracking-tight leading-tight`}>
                {alert.message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`
                flex-shrink-0 rounded-full p-2 transition-all duration-200
                ${config.button}
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              aria-label="Dismiss notification"
            >
              <IconClose />
            </button>
          </div>
        </div>
        <ProgressBar duration={duration} config={config} />
      </div>
    </div>
  );
};

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [duration, setDuration] = useState(5000);
  const timerRef = useRef(null);

  const showAlert = useCallback((message, type = "info", customDuration = 5000) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setAlert({ message, type });
    setDuration(customDuration);
    timerRef.current = setTimeout(() => {
      setAlert(null);
      timerRef.current = null;
    }, customDuration);
  }, []);

  const hideAlert = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAlert(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      {alert && <Alert alert={alert} onClose={hideAlert} duration={duration} />}
    </AlertContext.Provider>
  );
}

export { AlertContext };