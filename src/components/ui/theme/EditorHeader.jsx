import React from "react";
import {
  Save,
  Eye,
  Undo,
  Redo,
  Settings,
  X,
  Loader2,
  Menu,
} from "lucide-react";

export default function EditorHeader({
  theme,
  isDirty,
  saving,
  canUndo,
  canRedo,
  onClose,
  onUndo,
  onRedo,
  onPreview,
  onSave,
  onOpenTemplateModal,
  onToggleSettings,
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close editor"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{theme?.name}</h1>
          <p className="text-xs text-gray-500">
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTemplateModal}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Change Template</span>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo
                ? "hover:bg-white text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo
                ? "hover:bg-white text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onToggleSettings}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>

        <button
          onClick={onPreview}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={onSave}
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
  );
}
