import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import TopLoader from "./components/ui/loaders/TopLoader";

function App() {
  return (
    <>
      <ScrollToTop />
      <TopLoader />
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
