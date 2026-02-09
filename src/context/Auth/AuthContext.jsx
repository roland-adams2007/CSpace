import { createContext, useState, useRef, useEffect } from "react";
import axiosInstance from "./../../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const hasFetchedUser = useRef(false);
  const failedAttemptsRef = useRef(0);

  const getToken = () => localStorage.getItem("accessToken");

  const clearSession = () => {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    failedAttemptsRef.current = 0;
    setUser(null);
    hasFetchedUser.current = false;
  };

  const handleFailedAttempt = () => {
    failedAttemptsRef.current += 1;

    if (failedAttemptsRef.current >= 3) {
      console.warn(
        "Clearing access token due to 3 consecutive failed profile fetch attempts",
      );
      clearSession();
    }
  };

  const fetchUserDetails = async () => {
    if (user) return;

    try {
      setLoadingUser(true);

      const { data } = await axiosInstance.get("/users/me");

      if (data?.data) {
        setUser(data.data);
        failedAttemptsRef.current = 0;
      } else {
        setUser(null);
        handleFailedAttempt();
      }
    } catch (err) {
      console.error(err);
      setUser(null);
      handleFailedAttempt();
    } finally {
      hasFetchedUser.current = true;
      setLoadingUser(false);
    }
  };

  const login = (userData, token) => {
    if (token) localStorage.setItem("accessToken", token);

    setUser(userData);
    failedAttemptsRef.current = 0;
    hasFetchedUser.current = true;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
      // ignore
    } finally {
      clearSession();
    }
  };

  useEffect(() => {
    const token = getToken();

    if (token && !hasFetchedUser.current) {
      fetchUserDetails();
    } else if (!token) {
      setUser(null);
      failedAttemptsRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loadingUser,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
