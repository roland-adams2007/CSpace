import { useNavigate, useLocation } from "react-router-dom";
import { useWebsiteStore } from "../store/store";

// Import all needed Lucide icons
import {
  LayoutDashboard,
  Edit3,
  FolderOpen,
  Inbox,
  Zap,
  TrendingUp,
  Users,
  CreditCard,
  Settings,
  Layers,
  HardDrive,
  LogOut,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedWebsite } = useWebsiteStore();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/website-builder", icon: Edit3, label: "Website Builder" },
    { path: "/files", icon: FolderOpen, label: "File Manager" },
    { path: "/messages", icon: Inbox, label: "Messages", badge: 8 },
    { path: "/automations", icon: Zap, label: "Automations" },
    { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  ];

  const settingsItems = [
    { path: "/team", icon: Users, label: "Team" },
    { path: "/billing", icon: CreditCard, label: "Billing" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                CreatorSpace
              </h1>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`sidebar-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Settings
            </p>
            <div className="space-y-0.5">
              {settingsItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`sidebar-link flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-xs">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">Free Plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
              title="Logout"
              type="button"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
