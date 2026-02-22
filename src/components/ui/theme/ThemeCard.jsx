import { Eye, MoreVertical, Edit3, CheckCircle, Trash2, Copy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThemeCard({ theme, onSetActive, onDelete, onDuplicate, websiteSlug }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isActive = theme.is_active === 1;
  const isTemplate = theme.template_id !== null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = 200;

      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
    }
  }, [showMenu]);

  const handleEdit = () => {
    navigate(`/website-builder/${websiteSlug}/theme/${theme.slug}/edit`);
  };

  const handlePreview = () => {
    window.open(`${import.meta.env.VITE_APP_URL}/t/${theme.slug}`, "_blank");
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3" /> Active
        </span>
      );
    }
    if (isTemplate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
          From Template
        </span>
      );
    }
    return null;
  };

  const getGradientColor = () => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-rose-500 to-pink-600",
      "from-indigo-600 to-purple-700",
    ];
    const index = theme.id ? theme.id % colors.length : 0;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      <div className={`h-32 bg-gradient-to-br ${getGradientColor()} relative flex items-center justify-center`}>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {getStatusBadge()}
          {theme.template_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
              {theme.template_name}
            </span>
          )}
        </div>
        <button
          onClick={handlePreview}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all text-sm font-medium"
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3 relative">
          <div
            className="relative inline-block max-w-full"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <h3 className="font-semibold text-gray-900 text-base truncate max-w-full cursor-default">
              {theme.name}
            </h3>
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-0 mb-1.5 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                {theme.name}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
            {theme.description || "No description"}
          </p>
          {theme.user_name && (
            <p className="text-xs text-gray-400 mt-1">
              Created by {theme.user_name}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-400 mb-3">
            Modified {formatDate(theme.updated_at)}
          </p>

          <div className="flex gap-2 relative">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Edit3 className="w-4 h-4" />
              Edit Theme
            </button>

            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all hover:border-indigo-300"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                style={{
                  position: "fixed",
                  zIndex: 9999,
                  ...(buttonRef.current
                    ? (() => {
                        const rect = buttonRef.current.getBoundingClientRect();
                        if (menuPosition === "top") {
                          return {
                            bottom: window.innerHeight - rect.top + 4,
                            right: window.innerWidth - rect.right,
                          };
                        }
                        return {
                          top: rect.bottom + 4,
                          right: window.innerWidth - rect.right,
                        };
                      })()
                    : {}),
                }}
                className="w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
              >
                {!isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActive(theme.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                    Set as Active
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(theme.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2 text-blue-500" />
                  Duplicate
                </button>

                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(theme.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Theme
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}