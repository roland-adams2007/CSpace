import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  Undo,
  Redo,
  Settings,
  X,
  Loader2,
  Menu,
  MoreVertical,
  Layout,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (fn) => {
    setMobileMenuOpen(false);
    fn?.();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
      {/* Left: Close + Title */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title="Close editor"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-[240px] md:max-w-xs">
            {theme?.name ?? "Untitled"}
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </p>
        </div>
      </div>

      {/* Right: Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Change Template */}
        <button
          onClick={onOpenTemplateModal}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Layout className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:inline">Change Template</span>
        </button>

        {/* Undo / Redo */}
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

        {/* Settings */}
        <button
          onClick={onToggleSettings}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:inline">Settings</span>
        </button>

        {/* Preview */}
        <button
          onClick={onPreview}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Eye className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!isDirty || saving}
          className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
            isDirty && !saving
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          ) : (
            <Save className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* Right: Mobile Actions */}
      <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
        <button
          onClick={onSave}
          disabled={!isDirty || saving}
          className={`p-2 rounded-lg transition-all ${
            isDirty && !saving
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          title={saving ? "Saving..." : "Save"}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>

        {/* Mobile overflow menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1 overflow-hidden">
              {/* Undo / Redo row */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 flex-1">History</span>
                <button
                  onClick={() => {
                    onUndo?.();
                    setMobileMenuOpen(false);
                  }}
                  disabled={!canUndo}
                  className={`p-1.5 rounded-lg transition-colors ${
                    canUndo
                      ? "hover:bg-gray-100 text-gray-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onRedo?.();
                    setMobileMenuOpen(false);
                  }}
                  disabled={!canRedo}
                  className={`p-1.5 rounded-lg transition-colors ${
                    canRedo
                      ? "hover:bg-gray-100 text-gray-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              <MobileMenuItem
                icon={<Layout className="w-4 h-4" />}
                label="Change Template"
                onClick={() => handleMenuAction(onOpenTemplateModal)}
              />
              <MobileMenuItem
                icon={<Eye className="w-4 h-4" />}
                label="Preview"
                onClick={() => handleMenuAction(onPreview)}
              />
              <MobileMenuItem
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                onClick={() => handleMenuAction(onToggleSettings)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileMenuItem({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
        disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="text-gray-500">{icon}</span>
      {label}
    </button>
  );
}
