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
  Film,
  Layers,
} from "lucide-react";
import { useWebsiteStore } from "../../../store/store";
import FilePickerModal from "../modals/FilePickerModal";
import { v4 as uuidv4 } from "uuid";
import { SECTION_VARIANTS } from "../../../utils/sectionLibrary";

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

  const toggleExpanded = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const openFilePicker = (fieldInfo) => {
    setCurrentImageField(fieldInfo);
    setShowFilePicker(true);
  };

  const handleFileSelect = (file) => {
    if (!currentImageField) return;
    const fileUrl = file.file_path;

    if (currentImageField.type === "header") {
      if (currentImageField.field === "logo")
        updateConfig("header.props.logo", fileUrl);
    } else if (currentImageField.sectionId) {
      if (currentImageField.arrayPath) {
        if (currentImageField.arrayPath === "carousel.slides") {
          const sec = config.layout.sections.find(
            (s) => s.id === currentImageField.sectionId,
          );
          if (!sec) return;
          const slides = [...(sec.props.carousel?.slides || [])];
          slides[currentImageField.index] = {
            ...slides[currentImageField.index],
            [currentImageField.field]: fileUrl,
          };
          const newProps = {
            ...sec.props,
            carousel: { ...sec.props.carousel, slides },
          };
          updateSection(currentImageField.sectionId, { props: newProps });
        } else {
          updateArrayItem(
            currentImageField.arrayPath,
            currentImageField.index,
            currentImageField.field,
            fileUrl,
          );
        }
      } else if (currentImageField.isStyle) {
        updateStyle(currentImageField.field, fileUrl);
      } else {
        updateProp(currentImageField.field, fileUrl);
      }
    }
    setShowFilePicker(false);
    setCurrentImageField(null);
  };

  // ── No selection ──────────────────────────────────────────────
  if (!selectedSection && !selectedHeader && !selectedFooter) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
            Theme Settings
          </h3>
          <p className="text-xs text-gray-500">Configure your theme</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                <p className="text-xs text-gray-500">
                  Columns, newsletter & style
                </p>
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
    );
  }

  // ── Header ────────────────────────────────────────────────────
  if (selectedHeader) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <PanelHeader
          title="Header Settings"
          onClose={() => selectHeader(false)}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {/* Style */}
          <SectionBlock title="Style">
            <div className="space-y-4">
              <LabeledField label="Height (px)">
                <input
                  type="number"
                  value={parseInt(config.header.style?.height) || 80}
                  onChange={(e) =>
                    updateConfig("header.style.height", `${e.target.value}px`)
                  }
                  className={INPUT_CLS}
                />
              </LabeledField>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.header.style?.sticky || false}
                  onChange={(e) =>
                    updateConfig("header.style.sticky", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Sticky Header</span>
              </label>
              <ColorField
                label="Background Color"
                value={config.header.style?.backgroundColor || "#ffffff"}
                onChange={(v) =>
                  updateConfig("header.style.backgroundColor", v)
                }
              />
            </div>
          </SectionBlock>

          {/* Logo */}
          <SectionBlock title="Logo">
            {config.header.props.logo && (
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
            )}
            <FileButton
              onClick={() => openFilePicker({ type: "header", field: "logo" })}
              label={config.header.props.logo ? "Change Logo" : "Upload Logo"}
            />
          </SectionBlock>

          {/* Navigation */}
          <SectionBlock
            title={`Navigation Menu (${config.header.props.menu?.length || 0})`}
            action={
              <button
                onClick={() =>
                  updateConfig("header.props.menu", [
                    ...(config.header.props.menu || []),
                    { id: Date.now().toString(), label: "New Link", url: "#" },
                  ])
                }
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            }
          >
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
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
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
                    className={`${INPUT_CLS} mb-2`}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={item.url || item.link || ""}
                    onChange={(e) => {
                      const menu = [...config.header.props.menu];
                      menu[idx] = {
                        ...menu[idx],
                        url: e.target.value,
                        link: e.target.value,
                      };
                      updateConfig("header.props.menu", menu);
                    }}
                    className={INPUT_CLS}
                  />
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* CTA */}
          <SectionBlock title="CTA Button">
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
              className={`${INPUT_CLS} mb-2`}
            />
            <input
              type="text"
              placeholder="Button Link"
              value={config.header.props.ctaButton?.link || ""}
              onChange={(e) =>
                updateConfig("header.props.ctaButton", {
                  ...config.header.props.ctaButton,
                  link: e.target.value,
                })
              }
              className={INPUT_CLS}
            />
          </SectionBlock>
        </div>

        <FilePicker
          show={showFilePicker}
          websiteId={selectedWebsite?.id}
          onClose={() => {
            setShowFilePicker(false);
            setCurrentImageField(null);
          }}
          onSelect={handleFileSelect}
        />
      </div>
    );
  }

  // ── Footer ────────────────────────────────────────────────────
  if (selectedFooter) {
    const fp = config.footer.props;
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <PanelHeader
          title="Footer Settings"
          onClose={() => selectFooter(false)}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {/* Style */}
          <SectionBlock title="Style">
            <div className="space-y-4">
              <ColorField
                label="Background Color"
                value={
                  fp.backgroundColor ||
                  config.footer.style?.backgroundColor ||
                  "#111827"
                }
                onChange={(v) =>
                  updateConfig("footer.style.backgroundColor", v)
                }
              />
              <ColorField
                label="Text Color"
                value={config.footer.style?.textColor || "#ffffff"}
                onChange={(v) => updateConfig("footer.style.textColor", v)}
              />
              <LabeledField label="Padding">
                <input
                  type="text"
                  value={config.footer.style?.padding || "3rem 0"}
                  onChange={(e) =>
                    updateConfig("footer.style.padding", e.target.value)
                  }
                  placeholder="3rem 0"
                  className={INPUT_CLS}
                />
              </LabeledField>
            </div>
          </SectionBlock>

          {/* Columns */}
          <SectionBlock
            title={`Footer Columns (${fp.columns?.length || 0})`}
            action={
              <button
                onClick={() =>
                  updateConfig("footer.props.columns", [
                    ...(fp.columns || []),
                    {
                      id: Date.now().toString(),
                      title: "New Column",
                      links: [],
                    },
                  ])
                }
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-3">
              {(fp.columns || []).map((col, idx) => (
                <div key={col.id || idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      placeholder="Column Title"
                      value={col.title}
                      onChange={(e) => {
                        const cols = [...fp.columns];
                        cols[idx] = { ...cols[idx], title: e.target.value };
                        updateConfig("footer.props.columns", cols);
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium"
                    />
                    <button
                      onClick={() => {
                        const cols = [...fp.columns];
                        cols.splice(idx, 1);
                        updateConfig("footer.props.columns", cols);
                      }}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {(col.links || []).map((link, lIdx) => (
                      <div key={lIdx} className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label || link.text || ""}
                          onChange={(e) => {
                            const cols = [...fp.columns];
                            cols[idx].links[lIdx] = {
                              ...cols[idx].links[lIdx],
                              label: e.target.value,
                              text: e.target.value,
                            };
                            updateConfig("footer.props.columns", cols);
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.link || link.url || ""}
                          onChange={(e) => {
                            const cols = [...fp.columns];
                            cols[idx].links[lIdx] = {
                              ...cols[idx].links[lIdx],
                              link: e.target.value,
                              url: e.target.value,
                            };
                            updateConfig("footer.props.columns", cols);
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          onClick={() => {
                            const cols = [...fp.columns];
                            cols[idx].links.splice(lIdx, 1);
                            updateConfig("footer.props.columns", cols);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const cols = [...fp.columns];
                        cols[idx].links = [
                          ...(cols[idx].links || []),
                          { label: "Link", link: "#" },
                        ];
                        updateConfig("footer.props.columns", cols);
                      }}
                      className="w-full px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* Newsletter in footer */}
          <SectionBlock title="Newsletter">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!fp.newsletter}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateConfig("footer.props.newsletter", {
                        title: "Stay Updated",
                        placeholder: "Enter your email",
                        buttonText: "Subscribe",
                      });
                    } else {
                      updateConfig("footer.props.newsletter", null);
                    }
                  }}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">
                  Show newsletter signup
                </span>
              </label>
              {fp.newsletter && (
                <div className="space-y-2 pl-2">
                  <input
                    type="text"
                    placeholder="Section title"
                    value={fp.newsletter.title || ""}
                    onChange={(e) =>
                      updateConfig("footer.props.newsletter", {
                        ...fp.newsletter,
                        title: e.target.value,
                      })
                    }
                    className={INPUT_CLS}
                  />
                  <input
                    type="text"
                    placeholder="Input placeholder"
                    value={fp.newsletter.placeholder || ""}
                    onChange={(e) =>
                      updateConfig("footer.props.newsletter", {
                        ...fp.newsletter,
                        placeholder: e.target.value,
                      })
                    }
                    className={INPUT_CLS}
                  />
                  <input
                    type="text"
                    placeholder="Button text"
                    value={fp.newsletter.buttonText || ""}
                    onChange={(e) =>
                      updateConfig("footer.props.newsletter", {
                        ...fp.newsletter,
                        buttonText: e.target.value,
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Social links in footer */}
          <SectionBlock
            title={`Social Links (${fp.socialLinks?.length || 0})`}
            action={
              <button
                onClick={() =>
                  updateConfig("footer.props.socialLinks", [
                    ...(fp.socialLinks || []),
                    { platform: "Twitter", link: "#" },
                  ])
                }
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-2">
              {(fp.socialLinks || []).map((social, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Platform"
                    value={social.platform}
                    onChange={(e) => {
                      const links = [...(fp.socialLinks || [])];
                      links[idx] = { ...links[idx], platform: e.target.value };
                      updateConfig("footer.props.socialLinks", links);
                    }}
                    className="w-1/3 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={social.link}
                    onChange={(e) => {
                      const links = [...(fp.socialLinks || [])];
                      links[idx] = { ...links[idx], link: e.target.value };
                      updateConfig("footer.props.socialLinks", links);
                    }}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      const links = [...(fp.socialLinks || [])];
                      links.splice(idx, 1);
                      updateConfig("footer.props.socialLinks", links);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* Copyright */}
          <SectionBlock title="Copyright Text">
            <textarea
              value={fp.copyright || ""}
              rows={2}
              onChange={(e) =>
                updateConfig("footer.props.copyright", e.target.value)
              }
              placeholder="© 2024 Your Company. All rights reserved."
              className={INPUT_CLS}
            />
          </SectionBlock>
        </div>
      </div>
    );
  }

  // ── Section ───────────────────────────────────────────────────
  const section = config.layout.sections.find((s) => s.id === selectedSection);
  if (!section) return null;

  const updateProp = (path, value) => {
    const keys = path.split(".");
    const newProps = { ...section.props };
    let cur = newProps;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    updateSection(section.id, { props: newProps });
  };

  const updateStyle = (path, value) => {
    const keys = path.split(".");
    const newStyle = { ...section.style };
    let cur = newStyle;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    updateSection(section.id, { style: newStyle });
  };

  const updateArrayItem = (arrayPath, index, itemPath, value) => {
    const array = [...(section.props[arrayPath] || [])];
    const keys = itemPath.split(".");
    let cur = array[index];
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    updateProp(arrayPath, array);
  };

  const addArrayItem = (arrayPath, template) => {
    const array = section.props[arrayPath] || [];
    const newItem =
      typeof template === "string" ? template : { ...template, id: uuidv4() };
    updateProp(arrayPath, [...array, newItem]);
  };

  const removeArrayItem = (arrayPath, index) => {
    const array = [...(section.props[arrayPath] || [])];
    array.splice(index, 1);
    updateProp(arrayPath, array);
  };

  const renderInput = (label, value, onChange, type = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLS}
          rows={4}
        />
      ) : type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLS}
        >
          {(onChange.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
          <FileButton
            onClick={() =>
              openFilePicker({
                sectionId: section.id,
                field: label.toLowerCase().replace(/\s/g, ""),
              })
            }
            label={value ? "Change Image" : "Upload Image"}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLS}
        />
      )}
    </div>
  );

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
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
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
                  className="absolute top-2 right-2 p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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

  // Carousel settings (reusable)
  const renderCarouselSettings = () => {
    const carousel = section.props.carousel;
    if (!carousel) return null;
    return (
      <SectionBlock
        title="Carousel Settings"
        icon={<Film className="w-4 h-4 text-indigo-500" />}
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={carousel.enabled || false}
              onChange={(e) => updateProp("carousel.enabled", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Enable Carousel</span>
          </label>
          {carousel.enabled && (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.autoplay || false}
                  onChange={(e) =>
                    updateProp("carousel.autoplay", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Autoplay</span>
              </label>
              <LabeledField label="Interval (ms)">
                <input
                  type="number"
                  value={carousel.interval || 5000}
                  step={500}
                  min={1000}
                  onChange={(e) =>
                    updateProp("carousel.interval", parseInt(e.target.value))
                  }
                  className={INPUT_CLS}
                />
              </LabeledField>

              {/* Hero slides editor */}
              {section.type === "hero" && carousel.slides && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Slides ({carousel.slides.length})
                    </span>
                    <button
                      onClick={() => {
                        const slides = [...(carousel.slides || [])];
                        slides.push({
                          id: uuidv4(),
                          image: "",
                          heading: `Slide ${slides.length + 1}`,
                          subheading: "",
                          ctaText: "Learn More",
                          ctaLink: "#",
                        });
                        updateProp("carousel.slides", slides);
                      }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {carousel.slides.map((slide, idx) => (
                      <div
                        key={slide.id || idx}
                        className="bg-white border border-gray-200 p-3 rounded-lg relative"
                      >
                        <button
                          onClick={() => {
                            const slides = [...carousel.slides];
                            slides.splice(idx, 1);
                            updateProp("carousel.slides", slides);
                          }}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Slide {idx + 1}
                        </p>
                        {slide.image && (
                          <div className="relative border rounded-lg p-1 mb-2">
                            <img
                              src={slide.image}
                              alt=""
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              onClick={() => {
                                const slides = [...carousel.slides];
                                slides[idx].image = "";
                                updateProp("carousel.slides", slides);
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() =>
                            openFilePicker({
                              sectionId: section.id,
                              arrayPath: "carousel.slides",
                              index: idx,
                              field: "image",
                            })
                          }
                          className="w-full mb-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                        >
                          {slide.image ? "Change Image" : "Add Image"}
                        </button>
                        {["heading", "subheading", "ctaText", "ctaLink"].map(
                          (field) => (
                            <input
                              key={field}
                              type="text"
                              placeholder={field}
                              value={slide[field] || ""}
                              onChange={(e) => {
                                const slides = [...carousel.slides];
                                slides[idx] = {
                                  ...slides[idx],
                                  [field]: e.target.value,
                                };
                                updateProp("carousel.slides", slides);
                              }}
                              className={`${INPUT_CLS} mb-1.5`}
                            />
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SectionBlock>
    );
  };

  // Variant selector
  const variants = SECTION_VARIANTS[section.type];
  const renderVariantSelector = () => {
    if (!variants) return null;

    const applyVariant = (value) => {
      // Build the complete new props in one shot — no separate updateProp calls
      // that would overwrite each other due to stale closure over section.props
      const newProps = { ...section.props, variant: value };

      // Sync carousel.enabled so SectionRenderer's isCarousel check works
      if (newProps.carousel) {
        newProps.carousel = {
          ...newProps.carousel,
          enabled: value === "carousel",
        };
      } else if (value === "carousel") {
        // Section doesn't have a carousel object yet — create a minimal one
        newProps.carousel = {
          enabled: true,
          autoplay: true,
          interval: 5000,
          slides: [],
        };
      }

      updateSection(section.id, { props: newProps });
    };

    const activeVariant = section.props.variant || variants[0].value;

    return (
      <SectionBlock
        title="Layout / Style"
        icon={<Layers className="w-4 h-4 text-indigo-500" />}
      >
        <div className="grid grid-cols-1 gap-1.5">
          {variants.map((v) => (
            <button
              key={v.value}
              onClick={() => applyVariant(v.value)}
              className={`px-3 py-2 rounded-lg text-sm text-left font-medium transition-all border-2 ${
                activeVariant === v.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-700 hover:border-indigo-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </SectionBlock>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <PanelHeader
        title="Section Properties"
        subtitle={`${section.type} section${section.props.carousel?.enabled ? " • Carousel" : ""}`}
        onClose={() => selectSection(null)}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Section ID */}
        <SectionBlock title="Section ID">
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
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use #{section.id} for navigation links
          </p>
        </SectionBlock>

        {/* Layout variant */}
        {renderVariantSelector()}

        {/* Section style */}
        <SectionBlock title="Section Style">
          <div className="space-y-4">
            <LabeledField label="Background Type">
              <select
                value={section.style?.backgroundType || "color"}
                onChange={(e) => updateStyle("backgroundType", e.target.value)}
                className={INPUT_CLS}
              >
                <option value="color">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </LabeledField>
            {(!section.style?.backgroundType ||
              section.style.backgroundType === "color") && (
              <ColorField
                label="Background Color"
                value={section.style?.backgroundColor || "#ffffff"}
                onChange={(v) => updateStyle("backgroundColor", v)}
              />
            )}
            {section.style?.backgroundType === "gradient" && (
              <LabeledField label="Gradient CSS">
                <input
                  type="text"
                  value={
                    section.style?.backgroundGradient ||
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }
                  onChange={(e) =>
                    updateStyle("backgroundGradient", e.target.value)
                  }
                  placeholder="linear-gradient(...)"
                  className={INPUT_CLS}
                />
              </LabeledField>
            )}
            {section.style?.backgroundType === "image" && (
              <div>
                {section.style?.backgroundImage && (
                  <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                    <img
                      src={section.style.backgroundImage}
                      alt="Background"
                      className="w-full h-28 object-cover rounded"
                    />
                    <button
                      onClick={() => updateStyle("backgroundImage", "")}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <FileButton
                  label={
                    section.style?.backgroundImage
                      ? "Change Image"
                      : "Upload Image"
                  }
                  onClick={() =>
                    openFilePicker({
                      sectionId: section.id,
                      field: "backgroundImage",
                      isStyle: true,
                    })
                  }
                />
                {section.style?.backgroundImage && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(
                        (section.style?.backgroundOverlay || 0) * 100,
                      )}
                      onChange={(e) =>
                        updateStyle("backgroundOverlay", e.target.value / 100)
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">
                      {Math.round(
                        (section.style?.backgroundOverlay || 0) * 100,
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            )}
            <LabeledField label="Padding Top (rem)">
              <input
                type="number"
                step={0.5}
                value={parseFloat(section.style?.padding?.top) ?? 4}
                onChange={(e) =>
                  updateStyle("padding.top", `${e.target.value}rem`)
                }
                className={INPUT_CLS}
              />
            </LabeledField>
            <LabeledField label="Padding Bottom (rem)">
              <input
                type="number"
                step={0.5}
                value={parseFloat(section.style?.padding?.bottom) ?? 4}
                onChange={(e) =>
                  updateStyle("padding.bottom", `${e.target.value}rem`)
                }
                className={INPUT_CLS}
              />
            </LabeledField>
          </div>
        </SectionBlock>

        {/* Carousel block */}
        {renderCarouselSettings()}

        {/* Content */}
        <SectionBlock title="Content">
          {section.props.heading !== undefined &&
            renderInput("Heading", section.props.heading, (v) =>
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
              "Content (HTML)",
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
              "Text Alignment",
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

          {section.props.primaryButton !== undefined && (
            <>
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Primary Button
                </p>
                <input
                  type="text"
                  placeholder="Text"
                  value={section.props.primaryButton?.text || ""}
                  onChange={(e) =>
                    updateProp("primaryButton.text", e.target.value)
                  }
                  className={`${INPUT_CLS} mb-2`}
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={section.props.primaryButton?.link || "#"}
                  onChange={(e) =>
                    updateProp("primaryButton.link", e.target.value)
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Secondary Button
                </p>
                <input
                  type="text"
                  placeholder="Text"
                  value={section.props.secondaryButton?.text || ""}
                  onChange={(e) =>
                    updateProp("secondaryButton.text", e.target.value)
                  }
                  className={`${INPUT_CLS} mb-2`}
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={section.props.secondaryButton?.link || "#"}
                  onChange={(e) =>
                    updateProp("secondaryButton.link", e.target.value)
                  }
                  className={INPUT_CLS}
                />
              </div>
            </>
          )}

          {section.props.submitText !== undefined &&
            renderInput("Submit Button Text", section.props.submitText, (v) =>
              updateProp("submitText", v),
            )}
          {section.props.placeholder !== undefined &&
            renderInput("Placeholder Text", section.props.placeholder, (v) =>
              updateProp("placeholder", v),
            )}
          {section.props.buttonText !== undefined &&
            renderInput("Button Text", section.props.buttonText, (v) =>
              updateProp("buttonText", v),
            )}
        </SectionBlock>

        {/* Arrays */}
        {section.props.features &&
          section.type !== "cta" &&
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

        {section.props.features &&
          section.type === "cta" &&
          renderArrayEditor(
            "Features List",
            "features",
            "New Feature",
            (item, idx) => (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const arr = [...section.props.features];
                  arr[idx] = e.target.value;
                  updateProp("features", arr);
                }}
                className={INPUT_CLS}
              />
            ),
          )}

        {section.props.benefits &&
          section.type !== "newsletter" &&
          renderArrayEditor(
            "Benefits",
            "benefits",
            {
              icon: "check-circle",
              title: "New Benefit",
              description: "Benefit description",
              metric: "",
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
                {renderInput("Metric", item.metric || "", (v) =>
                  update("metric", v),
                )}
              </>
            ),
          )}

        {section.props.benefits &&
          section.type === "newsletter" &&
          renderArrayEditor(
            "Benefits",
            "benefits",
            "New Benefit",
            (item, idx) => (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const arr = [...section.props.benefits];
                  arr[idx] = e.target.value;
                  updateProp("benefits", arr);
                }}
                className={INPUT_CLS}
              />
            ),
          )}

        {section.props.stats &&
          renderArrayEditor(
            "Statistics",
            "stats",
            { value: "0", label: "Stat Label", description: "" },
            (item, idx, update) => (
              <>
                {renderInput("Value", item.value, (v) => update("value", v))}
                {renderInput("Label", item.label, (v) => update("label", v))}
                {renderInput("Description", item.description || "", (v) =>
                  update("description", v),
                )}
              </>
            ),
          )}

        {section.props.steps &&
          renderArrayEditor(
            "Process Steps",
            "steps",
            {
              icon: "circle",
              title: "Step",
              description: "Description",
              duration: "",
              number: "",
            },
            (item, idx, update) => (
              <>
                {renderInput("Icon", item.icon, (v) => update("icon", v))}
                {renderInput("Number", item.number || "", (v) =>
                  update("number", v),
                )}
                {renderInput("Title", item.title, (v) => update("title", v))}
                {renderInput(
                  "Description",
                  item.description,
                  (v) => update("description", v),
                  "textarea",
                )}
                {renderInput("Duration", item.duration || "", (v) =>
                  update("duration", v),
                )}
              </>
            ),
          )}

        {section.props.logos &&
          renderArrayEditor(
            "Logos",
            "logos",
            { image: "", name: "Company", width: "120" },
            (item, idx, update) => (
              <>
                {renderInput("Company Name", item.name, (v) =>
                  update("name", v),
                )}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Logo Image
                  </label>
                  {item.image && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-16 object-contain"
                      />
                      <button
                        onClick={() => update("image", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <FileButton
                    label={item.image ? "Change Logo" : "Upload Logo"}
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "logos",
                        index: idx,
                        field: "image",
                      })
                    }
                  />
                </div>
                {renderInput("Width (px)", item.width, (v) =>
                  update("width", v),
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
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Avatar
                  </label>
                  {item.avatar && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.avatar}
                        alt="Avatar"
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        onClick={() => update("avatar", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <FileButton
                    label={item.avatar ? "Change Avatar" : "Upload Avatar"}
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "testimonials",
                        index: idx,
                        field: "avatar",
                      })
                    }
                  />
                </div>
                {renderInput(
                  "Rating (1–5)",
                  item.rating,
                  (v) => update("rating", parseInt(v)),
                  "number",
                )}
                {item.metric !== undefined &&
                  renderInput("Metric", item.metric, (v) =>
                    update("metric", v),
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
              description: "",
              features: [],
              ctaText: "Get Started",
              ctaLink: "#",
              highlighted: false,
              badge: "",
              savings: "",
            },
            (item, idx, update) => (
              <>
                {renderInput("Name", item.name, (v) => update("name", v))}
                {renderInput("Price", item.price, (v) => update("price", v))}
                {renderInput("Period", item.period || "", (v) =>
                  update("period", v),
                )}
                {renderInput("Description", item.description || "", (v) =>
                  update("description", v),
                )}
                {renderInput("CTA Text", item.ctaText, (v) =>
                  update("ctaText", v),
                )}
                {renderInput("CTA Link", item.ctaLink, (v) =>
                  update("ctaLink", v),
                )}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    value={(item.features || []).join("\n")}
                    rows={4}
                    onChange={(e) =>
                      update(
                        "features",
                        e.target.value.split("\n").filter((f) => f.trim()),
                      )
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.highlighted || false}
                    onChange={(e) => update("highlighted", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">
                    Highlighted Plan
                  </span>
                </label>
                {item.highlighted &&
                  renderInput("Badge Text", item.badge || "", (v) =>
                    update("badge", v),
                  )}
                {renderInput("Savings Tag", item.savings || "", (v) =>
                  update("savings", v),
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.required || false}
                    onChange={(e) => update("required", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </label>
              </>
            ),
          )}

        {section.props.faqs &&
          renderArrayEditor(
            "FAQ Items",
            "faqs",
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
            {
              name: "Name",
              role: "Role",
              bio: "Short bio",
              image: "",
              socials: {},
            },
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
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Photo
                  </label>
                  {item.image && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.image}
                        alt="Preview"
                        className="w-full h-28 object-cover rounded"
                      />
                      <button
                        onClick={() => update("image", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <FileButton
                    label={item.image ? "Change Photo" : "Upload Photo"}
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "members",
                        index: idx,
                        field: "image",
                      })
                    }
                  />
                </div>
              </>
            ),
          )}

        {/* Case studies */}
        {section.props.studies &&
          renderArrayEditor(
            "Case Studies",
            "studies",
            {
              title: "Case Study",
              client: "Client",
              description: "Overview",
              image: "",
              link: "#",
              results: [],
              metrics: [],
            },
            (item, idx, update) => (
              <>
                {renderInput("Title", item.title, (v) => update("title", v))}
                {renderInput("Client", item.client || "", (v) =>
                  update("client", v),
                )}
                {renderInput(
                  "Description",
                  item.description || "",
                  (v) => update("description", v),
                  "textarea",
                )}
                {renderInput("Link", item.link || "#", (v) =>
                  update("link", v),
                )}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cover Image
                  </label>
                  {item.image && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.image}
                        alt="Cover"
                        className="w-full h-28 object-cover rounded"
                      />
                      <button
                        onClick={() => update("image", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <FileButton
                    label={item.image ? "Change Image" : "Upload Image"}
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "studies",
                        index: idx,
                        field: "image",
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Results (one per line)
                  </label>
                  <textarea
                    value={(item.results || []).join("\n")}
                    rows={3}
                    onChange={(e) =>
                      update(
                        "results",
                        e.target.value.split("\n").filter((r) => r.trim()),
                      )
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </>
            ),
          )}

        {/* Trust badges */}
        {section.props.badges &&
          renderArrayEditor(
            "Trust Badges",
            "badges",
            {
              icon: "shield",
              title: "Certification",
              description: "Description",
            },
            (item, idx, update) => (
              <>
                {renderInput("Icon", item.icon, (v) => update("icon", v))}
                {renderInput("Title", item.title, (v) => update("title", v))}
                {renderInput("Description", item.description || "", (v) =>
                  update("description", v),
                )}
              </>
            ),
          )}

        {/* Trust awards */}
        {section.props.awards !== undefined && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">
                Awards / Accolades ({(section.props.awards || []).length})
              </span>
              <button
                onClick={() =>
                  updateProp("awards", [
                    ...(section.props.awards || []),
                    "New Award",
                  ])
                }
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(section.props.awards || []).map((award, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={award}
                    onChange={(e) => {
                      const arr = [...section.props.awards];
                      arr[idx] = e.target.value;
                      updateProp("awards", arr);
                    }}
                    className={`${INPUT_CLS} flex-1`}
                  />
                  <button
                    onClick={() => {
                      const arr = [...section.props.awards];
                      arr.splice(idx, 1);
                      updateProp("awards", arr);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery items */}
        {section.props.items &&
          section.type === "gallery" &&
          renderArrayEditor(
            "Gallery Items",
            "items",
            { image: "", title: "New Item", category: "", description: "" },
            (item, idx, update) => (
              <>
                {renderInput("Title", item.title, (v) => update("title", v))}
                {renderInput("Category", item.category || "", (v) =>
                  update("category", v),
                )}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image
                  </label>
                  {item.image && (
                    <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-28 object-cover rounded"
                      />
                      <button
                        onClick={() => update("image", "")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <FileButton
                    label={item.image ? "Change Image" : "Upload Image"}
                    onClick={() =>
                      openFilePicker({
                        sectionId: section.id,
                        arrayPath: "items",
                        index: idx,
                        field: "image",
                      })
                    }
                  />
                </div>
                {renderInput(
                  "Description",
                  item.description || "",
                  (v) => update("description", v),
                  "textarea",
                )}
              </>
            ),
          )}
      </div>

      <FilePicker
        show={showFilePicker}
        websiteId={selectedWebsite?.id}
        onClose={() => {
          setShowFilePicker(false);
          setCurrentImageField(null);
        }}
        onSelect={handleFileSelect}
      />
    </div>
  );
}

// ── Small reusable sub-components ────────────────────────────────

const INPUT_CLS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

function PanelHeader({ title, subtitle, onClose }) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 capitalize">{subtitle}</p>
      )}
    </div>
  );
}

function SectionBlock({ title, children, action, icon }) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {icon}
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}

function LabeledField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <LabeledField label={label}>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </LabeledField>
  );
}

function FileButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-600"
    >
      <ImageIcon className="w-4 h-4" />
      {label}
    </button>
  );
}

function FilePicker({ show, websiteId, onClose, onSelect }) {
  if (!show || !websiteId) return null;
  return (
    <FilePickerModal
      isOpen={show}
      onClose={onClose}
      onSelectFile={onSelect}
      websiteId={websiteId}
      allowedTypes={["image"]}
    />
  );
}
