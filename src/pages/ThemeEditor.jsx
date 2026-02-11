import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Eye, Undo, Redo, Settings, X, Loader2 } from "lucide-react";
import { useThemeStore } from "../store/store";
import { useEditorStore } from "../store/store";
import SectionLibrary from "../components/ui/theme/SectionLibrary";
import Canvas from "../components/ui/theme/Canvas";
import PropertiesPanel from "../components/ui/theme/PropertiesPanel";
import { createNewSection } from "../utils/sectionLibrary";

export default function ThemeEditor() {
  const { themeSlug } = useParams();
  const navigate = useNavigate();
  const { getTheme, updateTheme, loading } = useThemeStore();
  const {
    config,
    setConfig,
    addSection,
    undo,
    redo,
    canUndo,
    canRedo,
    isDirty,
    resetDirty,
  } = useEditorStore();

  const [theme, setTheme] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadTheme();
  }, [themeSlug]);

  const loadTheme = async () => {
    try {
      const themeData = await getTheme(themeSlug);
      setTheme(themeData);

      let configData = themeData.config_json;
      if (typeof configData === "string") {
        configData = JSON.parse(configData);
      }

      setConfig(configData);
    } catch (error) {
      console.error("Failed to load theme:", error);
      navigate("/website-builder");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTheme(theme.id, {
        config_json: JSON.stringify(config),
        name: theme.name,
      });
      resetDirty();
    } catch (error) {
      console.error("Failed to save theme:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = (libraryItem) => {
    const newSection = createNewSection(libraryItem);
    addSection(newSection);
  };

  const handlePreview = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Save before previewing?")) {
        handleSave().then(() => {
          window.open(
            `${import.meta.env.VITE_APP_URL}/t/${themeSlug}`,
            "_blank",
          );
        });
      } else {
        window.open(`${import.meta.env.VITE_APP_URL}/t/${themeSlug}`, "_blank");
      }
    } else {
      window.open(`${import.meta.env.VITE_APP_URL}/t/${themeSlug}`, "_blank");
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/website-builder");
      }
    } else {
      navigate("/website-builder");
    }
  };

  if (loading || !theme) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close editor"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {theme.name}
            </h1>
            <p className="text-xs text-gray-500">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`p-2 rounded-lg transition-colors ${
                canUndo()
                  ? "hover:bg-white text-gray-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`p-2 rounded-lg transition-colors ${
                canRedo()
                  ? "hover:bg-white text-gray-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isDirty && !saving
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SectionLibrary onAddSection={handleAddSection} />
        </div>

        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>

        <div className="w-80 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Theme Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={theme.name}
                    onChange={(e) =>
                      setTheme({ ...theme, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={theme.description || ""}
                    onChange={(e) =>
                      setTheme({ ...theme, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Theme Colors
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={config.theme.colors.primary}
                        onChange={(e) =>
                          useEditorStore
                            .getState()
                            .updateConfig(
                              "theme.colors.primary",
                              e.target.value,
                            )
                        }
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={config.theme.colors.secondary}
                        onChange={(e) =>
                          useEditorStore
                            .getState()
                            .updateConfig(
                              "theme.colors.secondary",
                              e.target.value,
                            )
                        }
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    setShowSettings(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}