import { useEffect, useState } from "react";
import StatsCard from "../components/ui/dashboard/StatsCard";
import { useWebsiteStore } from "../store/store";

export default function Dashboard() {
  const { selectedWebsite } = useWebsiteStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const stats = [
    {
      icon: "eye",
      title: "Total Visitors",
      value: "4,862",
      change: 12,
      color: "blue",
    },
    {
      icon: "folder",
      title: "Files Stored",
      value: "324",
      change: 8,
      color: "purple",
    },
    {
      icon: "mail",
      title: "New Messages",
      value: "89",
      change: 24,
      color: "emerald",
    },
    {
      icon: "zap",
      title: "Automations",
      value: "12",
      change: 0,
      color: "orange",
    },
  ];

  const activities = [
    {
      icon: "upload",
      title: "New file uploaded",
      description: "portfolio-hero.jpg added to Portfolio Studio",
      time: "2 hours ago",
      color: "blue",
    },
    {
      icon: "check-circle",
      title: "Design updated",
      description: "Homepage layout modified on Portfolio Studio",
      time: "1 day ago",
      color: "green",
    },
    {
      icon: "mail",
      title: "New message received",
      description: "Contact form submission from Sarah Johnson",
      time: "2 days ago",
      color: "purple",
    },
    {
      icon: "zap",
      title: "SEO optimized",
      description: "Meta tags updated for Portfolio Studio",
      time: "3 days ago",
      color: "orange",
    },
  ];

  useEffect(() => {
    const container = document.getElementById("statsContainer");
    const updateScrollIndicator = () => {
      if (window.innerWidth >= 640) return;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      setActiveSlide(Math.round(scrollLeft / containerWidth));
    };
    if (container) {
      container.addEventListener("scroll", updateScrollIndicator);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollIndicator);
      }
    };
  }, []);

  const scrollToSlide = (index) => {
    const container = document.getElementById("statsContainer");
    if (container) {
      const containerWidth = container.clientWidth;
      container.scrollTo({ left: index * containerWidth, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, John 👋</p>
        <div className="mt-3 flex items-center text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200 max-w-fit">
          <i data-lucide="globe" className="w-4 h-4 text-indigo-600 mr-2"></i>
          <span>Currently viewing:</span>
          <span className="font-medium text-indigo-700 ml-1">
            {selectedWebsite?.name || "No website selected"}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="stats-container" id="statsContainer">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-slide">
              <StatsCard
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                color={stat.color}
                websiteName={selectedWebsite?.name || "Portfolio Studio"}
              />
            </div>
          ))}
        </div>

        <div className="scroll-indicator flex justify-center sm:hidden">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`scroll-dot mx-1 ${activeSlide === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Latest updates on{" "}
                    <span className="font-medium">
                      {selectedWebsite?.name || "Portfolio Studio"}
                    </span>
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  Active Website
                </span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <i
                      data-lucide={activity.icon}
                      className={`w-4 h-4 text-${activity.color}-600`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View all activity →
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <i data-lucide="crown" className="w-6 h-6 text-white"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-indigo-100 mb-4">
              Unlock unlimited websites, storage & advanced features
            </p>
            <button className="w-full px-4 py-2.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors text-sm">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
