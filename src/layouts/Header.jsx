import { useEffect, useState } from "react";
import { useWebsiteStore } from "../store/store";
import WebsiteDropdown from "../components/website/WebsiteDropdown";

import { Menu, Globe, ChevronDown, Search, Bell } from "lucide-react";

export default function Header({ setSidebarOpen }) {
  const { selectedWebsite } = useWebsiteStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("#websiteDropdownBtn") &&
        !e.target.closest("#websiteDropdown")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="relative">
              <button
                id="websiteDropdownBtn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                type="button"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {selectedWebsite?.name || "Select Website"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <WebsiteDropdown
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400 w-40"
              />
            </div>

            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              type="button"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
