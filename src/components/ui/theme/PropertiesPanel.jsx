import { useState } from "react";
import { useEditorStore } from "../../../store/store";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { useWebsiteStore } from "../../../store/store";
import FilePickerModal from "../modals/FilePickerModal";

export default function PropertiesPanel() {
  const { selectedWebsite } = useWebsiteStore();
  const {
    config,
    selectedSection,
    selectedHeader,
    selectedFooter,
    updateSection,
    updateConfig,
    selectSection,
    selectHeader,
    selectFooter,
  } = useEditorStore();
  const [expandedSections, setExpandedSections] = useState({});
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);

  const toggleExpanded = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openFilePicker = (fieldInfo) => {
    setCurrentImageField(fieldInfo);
    setShowFilePicker(true);
  };

  const handleFileSelect = (file) => {
    if (!currentImageField) return;

    const fileUrl = `${file.file_path}`;

    if (currentImageField.type === "header") {
      if (currentImageField.field === "logo") {
        updateConfig("header.props.logo", fileUrl);
      }
    } else if (currentImageField.type === "footer") {
      
    } else if (currentImageField.sectionId) {
      if (currentImageField.arrayPath) {
        updateArrayItem(
          currentImageField.arrayPath,
          currentImageField.index,
          currentImageField.field,
          fileUrl,
        );
      } else if (currentImageField.isStyle) {
        updateStyle(currentImageField.field, fileUrl);
      } else {
        updateProp(currentImageField.field, fileUrl);
      }
    }

    setShowFilePicker(false);
    setCurrentImageField(null);
  };

  if (!selectedSection && !selectedHeader && !selectedFooter) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Theme Settings
          </h3>
          <p className="text-xs text-gray-500">Configure your theme</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <button
              onClick={() => selectHeader()}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Header Settings
                  </p>
                  <p className="text-xs text-gray-500">
                    Logo, navigation & style
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => selectFooter()}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Footer Settings
                  </p>
                  <p className="text-xs text-gray-500">Columns & style</p>
                </div>
              </div>
            </button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Click on a section in the canvas to edit its properties
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedHeader) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Header Settings
            </h3>
            <button
              onClick={() => selectHeader(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Style
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={parseInt(config.header.style?.height) || 80}
                  onChange={(e) =>
                    updateConfig("header.style.height", `${e.target.value}px`)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.header.style?.sticky || false}
                    onChange={(e) =>
                      updateConfig("header.style.sticky", e.target.checked)
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Sticky Header</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.header.style?.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateConfig("header.style.backgroundColor", e.target.value)
                    }
                    className="w-16 h-10 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.header.style?.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateConfig("header.style.backgroundColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Logo
            </h4>
            {config.header.props.logo ? (
              <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                <img
                  src={config.header.props.logo}
                  alt="Logo"
                  className="w-full h-20 object-contain"
                />
                <button
                  onClick={() => updateConfig("header.props.logo", "")}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null}
            <button
              onClick={() => openFilePicker({ type: "header", field: "logo" })}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
            >
              <ImageIcon className="w-4 h-4" />
              {config.header.props.logo ? "Change Logo" : "Upload Logo"}
            </button>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Navigation Menu ({config.header.props.menu?.length || 0})
              </h4>
              <button
                onClick={() => {
                  const menu = config.header.props.menu || [];
                  updateConfig("header.props.menu", [
                    ...menu,
                    { id: Date.now().toString(), label: "New Link", url: "#section-" + Date.now() },
                  ]);
                }}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {(config.header.props.menu || []).map((item, idx) => (
                <div key={item.id || idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      Link {idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        const menu = [...config.header.props.menu];
                        menu.splice(idx, 1);
                        updateConfig("header.props.menu", menu);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => {
                      const menu = [...config.header.props.menu];
                      menu[idx] = { ...menu[idx], label: e.target.value };
                      updateConfig("header.props.menu", menu);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded mb-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="URL (use #section-id for internal links)"
                    value={item.url}
                    onChange={(e) => {
                      const menu = [...config.header.props.menu];
                      menu[idx] = { ...menu[idx], url: e.target.value };
                      updateConfig("header.props.menu", menu);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              CTA Button
            </h4>
            <input
              type="text"
              placeholder="Button Text"
              value={config.header.props.ctaButton?.text || ""}
              onChange={(e) =>
                updateConfig("header.props.ctaButton", {
                  ...config.header.props.ctaButton,
                  text: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
            />
            <input
              type="text"
              placeholder="Button Link (use #section-id for internal links)"
              value={config.header.props.ctaButton?.link || ""}
              onChange={(e) =>
                updateConfig("header.props.ctaButton", {
                  ...config.header.props.ctaButton,
                  link: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {selectedWebsite && (
          <FilePickerModal
            isOpen={showFilePicker}
            onClose={() => {
              setShowFilePicker(false);
              setCurrentImageField(null);
            }}
            onSelectFile={handleFileSelect}
            websiteId={selectedWebsite.id}
            allowedTypes={["image"]}
          />
        )}
      </div>
    );
  }

  if (selectedFooter) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Footer Settings
            </h3>
            <button
              onClick={() => selectFooter(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Style
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.footer.style?.backgroundColor || "#111827"}
                    onChange={(e) =>
                      updateConfig("footer.style.backgroundColor", e.target.value)
                    }
                    className="w-16 h-10 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.footer.style?.backgroundColor || "#111827"}
                    onChange={(e) =>
                      updateConfig("footer.style.backgroundColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.footer.style?.textColor || "#ffffff"}
                    onChange={(e) =>
                      updateConfig("footer.style.textColor", e.target.value)
                    }
                    className="w-16 h-10 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.footer.style?.textColor || "#ffffff"}
                    onChange={(e) =>
                      updateConfig("footer.style.textColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Padding
                </label>
                <input
                  type="text"
                  value={config.footer.style?.padding || "3rem 0"}
                  onChange={(e) =>
                    updateConfig("footer.style.padding", e.target.value)
                  }
                  placeholder="3rem 0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Footer Columns ({config.footer.props.columns?.length || 0})
              </h4>
              <button
                onClick={() => {
                  const columns = config.footer.props.columns || [];
                  updateConfig("footer.props.columns", [
                    ...columns,
                    {
                      id: Date.now().toString(),
                      title: "New Column",
                      links: [],
                    },
                  ]);
                }}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(config.footer.props.columns || []).map((column, idx) => (
                <div
                  key={column.id || idx}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      placeholder="Column Title"
                      value={column.title}
                      onChange={(e) => {
                        const columns = [...config.footer.props.columns];
                        columns[idx] = {
                          ...columns[idx],
                          title: e.target.value,
                        };
                        updateConfig("footer.props.columns", columns);
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium"
                    />
                    <button
                      onClick={() => {
                        const columns = [...config.footer.props.columns];
                        columns.splice(idx, 1);
                        updateConfig("footer.props.columns", columns);
                      }}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1 mt-2">
                    {(column.links || []).map((link, linkIdx) => (
                      <div key={linkIdx} className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Link text"
                          value={link.text}
                          onChange={(e) => {
                            const columns = [...config.footer.props.columns];
                            columns[idx].links[linkIdx] = {
                              ...columns[idx].links[linkIdx],
                              text: e.target.value,
                            };
                            updateConfig("footer.props.columns", columns);
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL (use # for internal links)"
                          value={link.url}
                          onChange={(e) => {
                            const columns = [...config.footer.props.columns];
                            columns[idx].links[linkIdx] = {
                              ...columns[idx].links[linkIdx],
                              url: e.target.value,
                            };
                            updateConfig("footer.props.columns", columns);
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          onClick={() => {
                            const columns = [...config.footer.props.columns];
                            columns[idx].links.splice(linkIdx, 1);
                            updateConfig("footer.props.columns", columns);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const columns = [...config.footer.props.columns];
                        columns[idx].links = [
                          ...(columns[idx].links || []),
                          { text: "Link", url: "#" },
                        ];
                        updateConfig("footer.props.columns", columns);
                      }}
                      className="w-full px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright Text
            </label>
            <textarea
              value={config.footer.props.copyright || ""}
              onChange={(e) =>
                updateConfig("footer.props.copyright", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows="2"
              placeholder="© 2024 Your Company. All rights reserved."
            />
          </div>
        </div>
      </div>
    );
  }

  const section = config.layout.sections.find((s) => s.id === selectedSection);
  if (!section) {
    return null;
  }

  const updateProp = (path, value) => {
    const keys = path.split(".");
    const newProps = { ...section.props };
    let current = newProps;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    updateSection(section.id, { props: newProps });
  };

  const updateStyle = (path, value) => {
    const keys = path.split(".");
    const newStyle = { ...section.style };
    let current = newStyle;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    updateSection(section.id, { style: newStyle });
  };

  const updateArrayItem = (arrayPath, index, itemPath, value) => {
    const array = [...section.props[arrayPath]];
    const keys = itemPath.split(".");
    let current = array[index];

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    updateProp(arrayPath, array);
  };

  const addArrayItem = (arrayPath, template) => {
    const array = section.props[arrayPath] || [];
    updateProp(arrayPath, [
      ...array,
      { ...template, id: Date.now().toString() },
    ]);
  };

  const removeArrayItem = (arrayPath, index) => {
    const array = [...section.props[arrayPath]];
    array.splice(index, 1);
    updateProp(arrayPath, array);
  };

  const renderInput = (label, value, onChange, type = "text") => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            rows="4"
          />
        ) : type === "select" ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {onChange.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "number" ? (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        ) : type === "image" ? (
          <div>
            {value && (
              <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => onChange("")}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() =>
                openFilePicker({
                  sectionId: section.id,
                  field: label.toLowerCase().replace(/\s/g, ""),
                })
              }
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
            >
              <ImageIcon className="w-4 h-4" />
              {value ? "Change Image" : "Upload Image"}
            </button>
          </div>
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        )}
      </div>
    );
  };

  const renderArrayEditor = (label, arrayPath, itemTemplate, renderItem) => {
    const items = section.props[arrayPath] || [];
    const isExpanded = expandedSections[arrayPath];

    return (
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => toggleExpanded(arrayPath)}
            className="flex items-center gap-2 text-sm font-medium text-gray-900"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {label} ({items.length})
          </button>
          <button
            onClick={() => addArrayItem(arrayPath, itemTemplate)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Add item"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 pl-4">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-gray-50 p-4 rounded-lg relative"
              >
                <button
                  onClick={() => removeArrayItem(arrayPath, idx)}
                  className="absolute top-2 right-2 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {renderItem(item, idx, (path, value) =>
                  updateArrayItem(arrayPath, idx, path, value),
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Section Properties
          </h3>
          <button
            onClick={() => selectSection(null)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-500 capitalize">
          {section.type} Section
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Section ID
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={section.id}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(section.id)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            >
              Copy ID
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use this ID for navigation links (e.g., #{section.id})
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Section Style
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Type
              </label>
              <select
                value={section.style?.backgroundType || "color"}
                onChange={(e) => updateStyle("backgroundType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="color">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>

            {section.style?.backgroundType === "color" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={section.style?.backgroundColor || "#ffffff"}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={section.style?.backgroundColor || "#ffffff"}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            {section.style?.backgroundType === "gradient" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient
                </label>
                <input
                  type="text"
                  value={section.style?.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
                  onChange={(e) => updateStyle("backgroundGradient", e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            )}

            {section.style?.backgroundType === "image" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                {section.style?.backgroundImage && (
                  <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                    <img
                      src={section.style.backgroundImage}
                      alt="Background"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => updateStyle("backgroundImage", "")}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() =>
                    openFilePicker({
                      sectionId: section.id,
                      field: "backgroundImage",
                      isStyle: true,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <ImageIcon className="w-4 h-4" />
                  {section.style?.backgroundImage ? "Change Image" : "Upload Image"}
                </button>
                
                {section.style?.backgroundImage && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Image Overlay Opacity
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(section.style?.backgroundOverlay || 0) * 100}
                        onChange={(e) => updateStyle("backgroundOverlay", e.target.value / 100)}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{Math.round((section.style?.backgroundOverlay || 0) * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding Top (rem)
              </label>
              <input
                type="number"
                value={parseFloat(section.style?.padding?.top) || 4}
                onChange={(e) => updateStyle("padding.top", `${e.target.value}rem`)}
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding Bottom (rem)
              </label>
              <input
                type="number"
                value={parseFloat(section.style?.padding?.bottom) || 4}
                onChange={(e) => updateStyle("padding.bottom", `${e.target.value}rem`)}
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Content
          </h4>
          
          {renderInput("Heading", section.props.heading, (v) =>
            updateProp("heading", v),
          )}

          {section.props.subheading !== undefined &&
            renderInput(
              "Subheading",
              section.props.subheading,
              (v) => updateProp("subheading", v),
              "textarea",
            )}

          {section.props.content !== undefined &&
            renderInput(
              "Content",
              section.props.content,
              (v) => updateProp("content", v),
              "textarea",
            )}

          {section.props.image !== undefined &&
            renderInput(
              "Image",
              section.props.image,
              (v) => updateProp("image", v),
              "image",
            )}

          {section.props.imagePosition !== undefined &&
            renderInput(
              "Image Position",
              section.props.imagePosition,
              Object.assign((v) => updateProp("imagePosition", v), {
                options: [
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ],
              }),
              "select",
            )}

          {section.props.ctaText !== undefined &&
            renderInput("CTA Text", section.props.ctaText, (v) =>
              updateProp("ctaText", v),
            )}

          {section.props.ctaLink !== undefined &&
            renderInput("CTA Link", section.props.ctaLink, (v) =>
              updateProp("ctaLink", v),
            )}

          {section.props.alignment !== undefined &&
            renderInput(
              "Alignment",
              section.props.alignment,
              Object.assign((v) => updateProp("alignment", v), {
                options: [
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ],
              }),
              "select",
            )}

          {section.props.columns !== undefined &&
            renderInput(
              "Columns",
              section.props.columns,
              (v) => updateProp("columns", parseInt(v)),
              "number",
            )}
        </div>

        {section.props.features &&
          renderArrayEditor(
            "Features",
            "features",
            {
              icon: "zap",
              title: "New Feature",
              description: "Feature description",
            },
            (item, idx, update) => (
              <>
                {renderInput("Icon", item.icon, (v) => update("icon", v))}
                {renderInput("Title", item.title, (v) => update("title", v))}
                {renderInput(
                  "Description",
                  item.description,
                  (v) => update("description", v),
                  "textarea",
                )}
              </>
            ),
          )}

        {section.props.testimonials &&
          renderArrayEditor(
            "Testimonials",
            "testimonials",
            {
              name: "Name",
              role: "Role",
              content: "Testimonial content",
              avatar: "",
              rating: 5,
            },
            (item, idx, update) => (
              <>
                {renderInput("Name", item.name, (v) => update("name", v))}
                {renderInput("Role", item.role, (v) => update("role", v))}
                {renderInput(
                  "Content",
                  item.content,
                  (v) => update("content", v),
                  "textarea",
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  {item.avatar && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.avatar}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => update("avatar", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "testimonials",
                        index: idx,
                        field: "avatar",
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {item.avatar ? "Change Avatar" : "Upload Avatar"}
                  </button>
                </div>
                {renderInput(
                  "Rating",
                  item.rating,
                  (v) => update("rating", parseInt(v)),
                  "number",
                )}
              </>
            ),
          )}

        {section.props.plans &&
          renderArrayEditor(
            "Pricing Plans",
            "plans",
            {
              name: "Plan Name",
              price: "$0",
              period: "month",
              features: [],
              ctaText: "Get Started",
              ctaLink: "#",
              highlighted: false,
            },
            (item, idx, update) => (
              <>
                {renderInput("Name", item.name, (v) => update("name", v))}
                {renderInput("Price", item.price, (v) => update("price", v))}
                {renderInput("CTA Text", item.ctaText, (v) =>
                  update("ctaText", v),
                )}
              </>
            ),
          )}

        {section.props.fields &&
          renderArrayEditor(
            "Form Fields",
            "fields",
            { type: "text", label: "Field Label", required: false },
            (item, idx, update) => (
              <>
                {renderInput("Label", item.label, (v) => update("label", v))}
                {renderInput(
                  "Type",
                  item.type,
                  Object.assign((v) => update("type", v), {
                    options: [
                      { value: "text", label: "Text" },
                      { value: "email", label: "Email" },
                      { value: "tel", label: "Phone" },
                      { value: "textarea", label: "Textarea" },
                    ],
                  }),
                  "select",
                )}
              </>
            ),
          )}

        {section.props.questions &&
          renderArrayEditor(
            "Questions",
            "questions",
            { question: "Question?", answer: "Answer" },
            (item, idx, update) => (
              <>
                {renderInput("Question", item.question, (v) =>
                  update("question", v),
                )}
                {renderInput(
                  "Answer",
                  item.answer,
                  (v) => update("answer", v),
                  "textarea",
                )}
              </>
            ),
          )}

        {section.props.members &&
          renderArrayEditor(
            "Team Members",
            "members",
            { name: "Name", role: "Role", bio: "Short bio", image: "" },
            (item, idx, update) => (
              <>
                {renderInput("Name", item.name, (v) => update("name", v))}
                {renderInput("Role", item.role, (v) => update("role", v))}
                {renderInput(
                  "Bio",
                  item.bio,
                  (v) => update("bio", v),
                  "textarea",
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  {item.image && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => update("image", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "members",
                        index: idx,
                        field: "image",
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {item.image ? "Change Image" : "Upload Image"}
                  </button>
                </div>
              </>
            ),
          )}
      </div>

      {selectedWebsite && (
        <FilePickerModal
          isOpen={showFilePicker}
          onClose={() => {
            setShowFilePicker(false);
            setCurrentImageField(null);
          }}
          onSelectFile={(file) => {
            const fileUrl = file.file_path;
            
            if (currentImageField.isStyle) {
              updateStyle(currentImageField.field, fileUrl);
            } else if (currentImageField.arrayPath) {
              updateArrayItem(
                currentImageField.arrayPath,
                currentImageField.index,
                currentImageField.field,
                fileUrl,
              );
            } else {
              updateProp(currentImageField.field, fileUrl);
            }
            
            setShowFilePicker(false);
            setCurrentImageField(null);
          }}
          websiteId={selectedWebsite.id}
          allowedTypes={["image"]}
        />
      )}
    </div>
  );
}