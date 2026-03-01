import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import WebsiteSelect from "../components/website/WebsiteSelect";
import { useState } from "react";
import { useWebsiteSelect } from "../hooks/useWebsiteSelect";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showWebsiteSelect, setShowWebsiteSelect } = useWebsiteSelect();

  return (
    <div className="min-h-screen bg-gray-50">
      {showWebsiteSelect && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" />
          <WebsiteSelect onDone={() => setShowWebsiteSelect(false)}  isManualOpen={true}  />
        </>
      )}

      <div className="lg:hidden">
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          setSidebarOpen={setSidebarOpen}
          onNewWebsite={() => {
            setShowWebsiteSelect(true);
          }}
        />
        <main className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
