import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useEditorStore } from "../../../../store/store";
import { useNavigate, useParams } from "react-router-dom";

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  config,
  onSave,
}) {
  const { websiteSlug } = useParams();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    try {
      await onSave();
      onClose();
    } catch (error) {
      console.error("Failed to save theme:", error);
      alert("Failed to save theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Theme Settings
            </h2>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
                  onThemeChange({ ...theme, name: e.target.value })
                }
                disabled={isSaving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        .updateConfig("theme.colors.primary", e.target.value)
                    }
                    disabled={isSaving}
                    className="w-full h-10 rounded-lg border border-gray-300 disabled:opacity-50"
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
                        .updateConfig("theme.colors.secondary", e.target.value)
                    }
                    disabled={isSaving}
                    className="w-full h-10 rounded-lg border border-gray-300 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
