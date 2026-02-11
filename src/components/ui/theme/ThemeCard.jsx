import { Eye, MoreVertical, Edit3, Star, CheckCircle, FileText, Trash2, Copy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThemeCard({ theme, onSetActive, onDelete, onDuplicate, websiteSlug }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isSystem = !theme.user_id;
  const isActive = theme.is_active === 1;
  const isDefault = theme.is_default === 1;
  const isDraft = theme.status === 'draft';

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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    if (isSystem) return;
    navigate(`/website-builder/${websiteSlug}/theme/${theme.slug}/edit`);
  };

  const handlePreview = () => {
    window.open(`${import.meta.env.VITE_APP_URL}/t/${theme.slug}`, '_blank');
  };

  const getStatusBadge = () => {
    if (isDefault) {
      return (
        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold rounded-full flex items-center shadow-sm">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Default
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center shadow-sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    if (isDraft) {
      return (
        <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center shadow-sm">
          <FileText className="w-3 h-3 mr-1" />
          Draft
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
    <div className={`group bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isActive ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
      <div className={`relative h-48 bg-gradient-to-br ${getGradientColor()} overflow-hidden`}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          {getStatusBadge()}
          {isSystem && (
            <span className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              System
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
            <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
              {theme.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {theme.description || "No description"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Modified {formatDate(theme.updated_at)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            disabled={isSystem}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isSystem
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-1.5" />
            {isSystem ? 'Read Only' : 'Edit Theme'}
          </button>

          <button
            onClick={handlePreview}
            className="px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all hover:border-indigo-300"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all hover:border-indigo-300"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                style={{ animation: 'fadeIn 0.2s ease-out' }}
              >
                {!isActive && !isSystem && (
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

                {!isSystem && !isDefault && (
                  <>
                    <div className="my-1 border-t border-gray-100"></div>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}