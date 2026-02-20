import { useEffect, useState } from "react";
import { Plus, Filter, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWebsiteStore } from "../store/store";
import { useThemeStore } from "../store/store";
import ThemeCard from "../components/ui/theme/ThemeCard";
import Pagination from "../components/ui/Pagination";

export default function WebsiteBuilder() {
  const { selectedWebsite } = useWebsiteStore();
  const {
    themes,
    loading,
    fetchThemes,
    setActiveTheme,
    deleteTheme,
    createTheme,
  } = useThemeStore();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [creating, setCreating] = useState(false);

  const itemsPerPage = 9;

  useEffect(() => {
    if (selectedWebsite?.id) {
      fetchThemes(selectedWebsite.id);
    }
  }, [selectedWebsite]);

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    if (activeFilter === "active") return theme.is_active === 1;
    if (activeFilter === "draft") return theme.status === "draft";
    if (activeFilter === "default") return theme.is_default === 1;
    if (activeFilter === "system") return !theme.user_id;

    return true;
  });

  const totalPages = Math.ceil(filteredThemes.length / itemsPerPage);
  const paginatedThemes = filteredThemes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCreateTheme = async () => {
    if (!selectedWebsite?.id) {
      alert("Please select a website first");
      return;
    }

    setCreating(true);
    try {
      const newTheme = await createTheme({
        website_id: selectedWebsite.id,
        name: "New Theme",
        description: "A new custom theme",
      });

      if (newTheme && newTheme.slug) {
        navigate(
          `/website-builder/${selectedWebsite.slug}/theme/${newTheme.slug}/edit`,
        );
      } else {
        throw new Error("Theme created but missing slug");
      }
    } catch (error) {
      console.error("Failed to create theme:", error);
      alert("Failed to create theme. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleSetActive = async (themeId) => {
    try {
      await setActiveTheme(themeId, selectedWebsite.id);
      await fetchThemes(selectedWebsite.id);
    } catch (error) {
      console.error("Failed to set active theme:", error);
      alert("Failed to set active theme");
    }
  };

  const handleDelete = async (themeId) => {
    setShowDeleteModal(themeId);
  };

  const confirmDelete = async () => {
    try {
      await deleteTheme(showDeleteModal);
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete theme:", error);
      alert("Failed to delete theme");
    }
  };

  const handleDuplicate = async (themeId) => {
    const originalTheme = themes.find((t) => t.id === themeId);
    if (!originalTheme) return;

    try {
      await createTheme({
        website_id: selectedWebsite.id,
        name: `${originalTheme.name} (Copy)`,
        description: originalTheme.description,
        config_json: originalTheme.config_json,
      });
      // Refresh themes list
      await fetchThemes(selectedWebsite.id);
    } catch (error) {
      console.error("Failed to duplicate theme:", error);
      alert("Failed to duplicate theme");
    }
  };

  const filters = [
    { id: "all", label: "All Themes", count: themes.length },
    {
      id: "active",
      label: "Active",
      count: themes.filter((t) => t.is_active === 1).length,
    },
    {
      id: "draft",
      label: "Draft",
      count: themes.filter((t) => t.status === "draft").length,
    },
    {
      id: "default",
      label: "Default",
      count: themes.filter((t) => t.is_default === 1).length,
    },
    {
      id: "system",
      label: "System",
      count: themes.filter((t) => !t.user_id).length,
    },
  ];

  if (!selectedWebsite) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Website Selected
          </h3>
          <p className="text-sm text-gray-500">
            Please select a website to manage themes
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Website Builder
            </h2>
            <p className="text-sm text-gray-500">
              Choose and customize your theme for{" "}
              <span className="font-medium text-indigo-600">
                {selectedWebsite.name}
              </span>
            </p>
          </div>
          <button
            onClick={handleCreateTheme}
            disabled={loading || creating}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{creating ? "Creating..." : "Create New Theme"}</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading && themes.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : paginatedThemes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                websiteSlug={selectedWebsite.slug}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredThemes.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No themes found
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery
              ? "Try adjusting your search"
              : "Try adjusting your filters or create a new theme"}
          </p>
          <button
            onClick={handleCreateTheme}
            disabled={creating}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{creating ? "Creating..." : "Create New Theme"}</span>
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Theme
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this theme? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
