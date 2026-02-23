import React, { useState } from "react";
import { X, Palette, Settings, Loader, Eye, EyeOff, Plus, Trash2, AlertCircle } from "lucide-react";
import { useEditorStore } from "../../../../store/store";
import FilePickerModal from "../FilePickerModal";
import { useWebsiteStore } from "../../../../store/store";

const INPUT_CLS = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

export default function SettingsModal({ isOpen, onClose, theme, onThemeChange, config, onSave }) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("theme");
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [showEnvValues, setShowEnvValues] = useState({});
  const { selectedWebsite } = useWebsiteStore();
  const { updateConfig } = useEditorStore();

  if (!isOpen) return null;

  const loader = config.siteSettings?.loader || {};
  const envVars = config.siteSettings?.envVars || [];

  const updateLoader = (key, value) => updateConfig("siteSettings.loader", { ...loader, [key]: value });

  const addEnvVar = () => updateConfig("siteSettings.envVars", [...envVars, { id: Date.now().toString(), key: "MY_VARIABLE", value: "", description: "" }]);

  const updateEnvVar = (idx, field, value) => {
    const arr = [...envVars];
    arr[idx] = { ...arr[idx], [field]: value };
    updateConfig("siteSettings.envVars", arr);
  };

  const removeEnvVar = (idx) => {
    const arr = [...envVars];
    arr.splice(idx, 1);
    updateConfig("siteSettings.envVars", arr);
  };

  const handleLoaderFileSelect = (file) => {
    updateLoader("image", file.file_path);
    setShowFilePicker(false);
  };

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

  const TABS = [
    { id: "theme", label: "Theme", icon: Palette },
    { id: "loader", label: "Loader", icon: Loader },
    { id: "env", label: "Variables", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Theme Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure colors, loader, and site variables</p>
          </div>
          <button onClick={onClose} disabled={isSaving} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "theme" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme Name</label>
                <input
                  type="text"
                  value={theme.name}
                  onChange={(e) => onThemeChange({ ...theme, name: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Theme Colors</h3>
                <p className="text-xs text-gray-500 mb-4">These are global defaults. Individual sections can override colors in their Properties panel.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "primary", label: "Primary Color" },
                    { key: "secondary", label: "Secondary Color" },
                    { key: "accent", label: "Accent Color" },
                    { key: "background", label: "Background Color" },
                    { key: "text", label: "Text Color" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm text-gray-700 mb-2">{label}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.theme?.colors?.[key] || "#6366f1"}
                          onChange={(e) => useEditorStore.getState().updateConfig(`theme.colors.${key}`, e.target.value)}
                          disabled={isSaving}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer disabled:opacity-50"
                        />
                        <input
                          type="text"
                          value={config.theme?.colors?.[key] || ""}
                          onChange={(e) => useEditorStore.getState().updateConfig(`theme.colors.${key}`, e.target.value)}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Typography</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "heading", label: "Heading Font" },
                    { key: "body", label: "Body Font" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm text-gray-700 mb-2">{label}</label>
                      <select
                        value={config.theme?.fonts?.[key] || "Inter"}
                        onChange={(e) => useEditorStore.getState().updateConfig(`theme.fonts.${key}`, e.target.value)}
                        disabled={isSaving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                      >
                        {["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Raleway", "Nunito", "Playfair Display", "Merriweather", "Georgia", "system-ui"].map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "loader" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                <Loader className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-700">The startup loader appears while your page is loading. It fades out automatically after the set duration.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={loader.enabled || false} onChange={(e) => updateLoader("enabled", e.target.checked)} className="rounded border-gray-300 text-indigo-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Enable Startup Loader</span>
              </label>

              {loader.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-indigo-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Loader Type</label>
                    <select value={loader.type || "spinner"} onChange={(e) => updateLoader("type", e.target.value)} className={INPUT_CLS}>
                      <option value="spinner">Spinner</option>
                      <option value="image">Image / Logo</option>
                      <option value="svg">Custom SVG</option>
                      <option value="progress">Progress Bar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={loader.backgroundColor || "#ffffff"} onChange={(e) => updateLoader("backgroundColor", e.target.value)} className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer" />
                      <input type="text" value={loader.backgroundColor || "#ffffff"} onChange={(e) => updateLoader("backgroundColor", e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>

                  {(loader.type === "spinner" || loader.type === "progress") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{loader.type === "spinner" ? "Spinner Color" : "Bar Color"}</label>
                      <div className="flex gap-2">
                        <input type="color" value={loader.spinnerColor || "#6366f1"} onChange={(e) => updateLoader("spinnerColor", e.target.value)} className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer" />
                        <input type="text" value={loader.spinnerColor || "#6366f1"} onChange={(e) => updateLoader("spinnerColor", e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    </div>
                  )}

                  {loader.type === "image" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Loader Image</label>
                      {loader.image && (
                        <div className="relative border-2 border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-center" style={{ backgroundColor: loader.backgroundColor || "#ffffff" }}>
                          <img src={loader.image} alt="Loader" className="h-16 object-contain" />
                          <button onClick={() => updateLoader("image", "")} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"><X className="w-3 h-3" /></button>
                        </div>
                      )}
                      <button onClick={() => setShowFilePicker(true)} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-sm text-gray-600">
                        {loader.image ? "Change Image" : "Upload Loader Image"}
                      </button>
                    </div>
                  )}

                  {loader.type === "svg" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom SVG Code</label>
                      <textarea
                        value={loader.svg || ""}
                        onChange={(e) => updateLoader("svg", e.target.value)}
                        rows={6}
                        placeholder={'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100">...</svg>'}
                        className={`${INPUT_CLS} font-mono text-xs`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (ms)</label>
                    <input type="number" value={loader.duration || 2000} min={500} step={100} onChange={(e) => updateLoader("duration", parseInt(e.target.value))} className={INPUT_CLS} />
                    <p className="text-xs text-gray-400 mt-1">How long the loader is visible before fading out</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Preview</p>
                    <div className="w-full h-28 rounded-lg flex items-center justify-center border border-gray-200" style={{ backgroundColor: loader.backgroundColor || "#ffffff" }}>
                      {loader.type === "spinner" && (
                        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${loader.spinnerColor || "#6366f1"} transparent transparent transparent` }} />
                      )}
                      {loader.type === "progress" && (
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full animate-pulse" style={{ backgroundColor: loader.spinnerColor || "#6366f1", width: "65%" }} />
                        </div>
                      )}
                      {loader.type === "image" && loader.image && <img src={loader.image} alt="Loader" className="h-14 object-contain" />}
                      {loader.type === "image" && !loader.image && <p className="text-xs text-gray-400">Upload an image above</p>}
                      {loader.type === "svg" && loader.svg && <div dangerouslySetInnerHTML={{ __html: loader.svg }} />}
                      {loader.type === "svg" && !loader.svg && <p className="text-xs text-gray-400">Enter SVG code above</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "env" && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">How to use variables</p>
                  <p className="text-xs text-amber-700">Add your form endpoint URLs and API keys here. Then paste the value directly into the "Submit URL" field in your section's Properties panel. Variables are stored securely in your theme config.</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Environment Variables</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{envVars.length} variable{envVars.length !== 1 ? "s" : ""} configured</p>
                </div>
                <button onClick={addEnvVar} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />Add Variable
                </button>
              </div>

              {envVars.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <Settings className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No variables yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add form endpoints, API keys, and webhook URLs</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {envVars.map((ev, idx) => (
                    <div key={ev.id || idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Variable Name</label>
                          <input
                            type="text"
                            placeholder="FORM_ENDPOINT"
                            value={ev.key || ""}
                            onChange={(e) => updateEnvVar(idx, "key", e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-white"
                          />
                        </div>
                        <button onClick={() => removeEnvVar(idx)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">Value</label>
                        <div className="relative">
                          <input
                            type={showEnvValues[idx] ? "text" : "password"}
                            placeholder="https://api.example.com/submit"
                            value={ev.value || ""}
                            onChange={(e) => updateEnvVar(idx, "value", e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm bg-white font-mono"
                          />
                          <button onClick={() => setShowEnvValues((prev) => ({ ...prev, [idx]: !prev[idx] }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                            {showEnvValues[idx] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Contact form submission endpoint"
                          value={ev.description || ""}
                          onChange={(e) => updateEnvVar(idx, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} disabled={isSaving} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            Cancel
          </button>
          <button onClick={handleSaveAndClose} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium">
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      {showFilePicker && selectedWebsite?.id && (
        <FilePickerModal isOpen={showFilePicker} onClose={() => setShowFilePicker(false)} onSelectFile={handleLoaderFileSelect} websiteId={selectedWebsite.id} allowedTypes={["image"]} />
      )}
    </div>
  );
}

