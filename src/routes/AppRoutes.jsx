import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import NotFound from "../components/errors/NotFound";
import AppLoader from "../components/ui/loaders/AppLoader";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Preview from "../pages/Preview";
import FIleManager from "../pages/FileManager";
import Forms from "../pages/Forms";
import Team from "../pages/Teams";
import TeamInvite from "../components/teams/TeamInvite";
import Settings from "../pages/Settings";
import HomePage from "../pages/HomePage";

const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const VerifyEmail = lazy(() => import("../components/auth/VerifyEmail"));
const WebsiteBuilder = lazy(() => import("../pages/WebsiteBuilder"));
const ThemeEditor = lazy(() => import("../pages/ThemeEditor"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team/invite" element={<TeamInvite />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reg" element={<Register />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/website-builder" element={<WebsiteBuilder />} />
            <Route path="/files" element={<FIleManager />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/automations" element={<>Automations</>} />
            <Route path="/analytics" element={<>Analytics</>} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route
            path="/website-builder/:websiteSlug/theme/:themeSlug/edit"
            element={<ThemeEditor />}
          />
        </Route>

        <Route path="/t/:themeSlug" element={<Preview />} />
        <Route path="/c/:websiteSlug" element={<Preview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
