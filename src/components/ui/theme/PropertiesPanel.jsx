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
  Link,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useWebsiteStore } from "../../../store/store";
import FilePickerModal from "../modals/FilePickerModal";
import { v4 as uuidv4 } from "uuid";
import { SECTION_VARIANTS, SECTION_TYPES } from "../../../utils/sectionLibrary";

const INPUT_CLS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

export default function PropertiesPanel() {
  const { selectedWebsite } = useWebsiteStore();
  const {
    config,
    selectedSection,
    updateSection,
    updateConfig,
    selectSection,
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
    if (currentImageField.sectionId) {
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
          updateSection(currentImageField.sectionId, {
            props: {
              ...sec.props,
              carousel: { ...sec.props.carousel, slides },
            },
          });
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

  if (!selectedSection) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
            Properties
          </h3>
          <p className="text-xs text-gray-500">Click on a section to edit</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <Settings className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-xs text-gray-500">
              Select a section in the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const section = config.layout.sections.find((s) => s.id === selectedSection);
  if (!section) return null;

  const themeColors = config.theme?.colors || {};
  const allSections = config.layout?.sections || [];

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
    const newStyle = { ...(section.style || {}) };
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

  const variants = SECTION_VARIANTS[section.type];
  const renderVariantSelector = () => {
    if (!variants) return null;
    const applyVariant = (value) => {
      const newProps = { ...section.props, variant: value };
      if (newProps.carousel) {
        newProps.carousel = {
          ...newProps.carousel,
          enabled: value === "carousel",
        };
      } else if (value === "carousel") {
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
              className={`px-3 py-2 rounded-lg text-sm text-left font-medium transition-all border-2 ${activeVariant === v.value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-700 hover:border-indigo-300"}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </SectionBlock>
    );
  };

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

  const renderHeaderProperties = () => {
    const p = section.props;
    return (
      <>
        {renderVariantSelector()}

        <SectionBlock title="Logo">
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={p.showLogo !== false}
              onChange={(e) => updateProp("showLogo", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Show Logo</span>
          </label>
          {p.showLogo !== false && (
            <>
              {p.logo && (
                <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                  <img
                    src={p.logo}
                    alt="Logo"
                    className="w-full h-16 object-contain"
                    style={{ maxHeight: `${p.logoHeight || 40}px` }}
                  />
                  <button
                    onClick={() => updateProp("logo", "")}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <FileButton
                label={p.logo ? "Change Logo" : "Upload Logo"}
                onClick={() =>
                  openFilePicker({ sectionId: section.id, field: "logo" })
                }
              />
              <div className="mt-3 space-y-3">
                <LabeledField label="Logo Height (px)">
                  <input
                    type="number"
                    value={p.logoHeight || 40}
                    min={16}
                    max={120}
                    onChange={(e) => updateProp("logoHeight", parseInt(e.target.value))}
                    className={INPUT_CLS}
                  />
                </LabeledField>
                <LabeledField label="Logo Text (fallback)">
                  <input
                    type="text"
                    value={p.logoText || ""}
                    onChange={(e) => updateProp("logoText", e.target.value)}
                    className={INPUT_CLS}
                  />
                </LabeledField>
              </div>
            </>
          )}
        </SectionBlock>

        <SectionBlock title="Appearance">
          <div className="space-y-4">
            <LabeledField label="Height (px)">
              <input
                type="number"
                value={parseInt(p.height) || 80}
                onChange={(e) => updateProp("height", `${e.target.value}px`)}
                className={INPUT_CLS}
              />
            </LabeledField>
            <ThemeColorField
              label="Background Color"
              value={p.backgroundColor || "#ffffff"}
              onChange={(v) => updateProp("backgroundColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Text / Link Color"
              value={p.textColor || "#111827"}
              onChange={(v) => updateProp("textColor", v)}
              themeColors={themeColors}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.transparent || false}
                onChange={(e) => updateProp("transparent", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">
                Transparent Background
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.blur || false}
                onChange={(e) => updateProp("blur", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">
                Blur Effect (glassmorphism)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.sticky !== false}
                onChange={(e) => updateProp("sticky", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Sticky Header</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.borderBottom !== false}
                onChange={(e) => updateProp("borderBottom", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Show Bottom Border</span>
            </label>
            {p.borderBottom !== false && (
              <ThemeColorField
                label="Border Color"
                value={p.borderColor || "#e5e7eb"}
                onChange={(v) => updateProp("borderColor", v)}
                themeColors={themeColors}
              />
            )}
          </div>
        </SectionBlock>

        <SectionBlock title="Navigation">
          <div className="space-y-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.showNav !== false}
                onChange={(e) => updateProp("showNav", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Show Navigation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p.showSearch || false}
                onChange={(e) => updateProp("showSearch", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Show Search Icon</span>
            </label>
            {p.showSearch && (
              <div className="pl-4 space-y-2">
                <ThemeColorField
                  label="Search Icon Color"
                  value={p.searchIconColor || p.textColor || "#111827"}
                  onChange={(v) => updateProp("searchIconColor", v)}
                  themeColors={themeColors}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Menu Items ({(p.menu || []).length})
            </span>
            <button
              onClick={() =>
                updateProp("menu", [
                  ...(p.menu || []),
                  {
                    id: uuidv4(),
                    label: "New Link",
                    url: "#",
                    hasSubmenu: false,
                    submenu: [],
                  },
                ])
              }
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {(p.menu || []).map((item, idx) => (
              <div key={item.id || idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Item {idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      const menu = [...p.menu];
                      menu.splice(idx, 1);
                      updateProp("menu", menu);
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
                    const menu = [...p.menu];
                    menu[idx] = { ...menu[idx], label: e.target.value };
                    updateProp("menu", menu);
                  }}
                  className={`${INPUT_CLS} mb-2`}
                />
                <SectionLinkField
                  label="URL"
                  value={item.url || ""}
                  onChange={(val) => {
                    const menu = [...p.menu];
                    menu[idx] = { ...menu[idx], url: val };
                    updateProp("menu", menu);
                  }}
                  sections={allSections}
                />
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={item.hasSubmenu || false}
                    onChange={(e) => {
                      const menu = [...p.menu];
                      menu[idx] = {
                        ...menu[idx],
                        hasSubmenu: e.target.checked,
                      };
                      updateProp("menu", menu);
                    }}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-xs text-gray-700">Has Submenu</span>
                </label>
                {item.hasSubmenu && (
                  <div className="ml-3 space-y-2">
                    {(item.submenu || []).map((sub, sIdx) => (
                      <div key={sub.id || sIdx} className="space-y-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Label"
                            value={sub.label || ""}
                            onChange={(e) => {
                              const menu = [...p.menu];
                              menu[idx].submenu[sIdx] = {
                                ...menu[idx].submenu[sIdx],
                                label: e.target.value,
                              };
                              updateProp("menu", menu);
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                          <button
                            onClick={() => {
                              const menu = [...p.menu];
                              menu[idx].submenu.splice(sIdx, 1);
                              updateProp("menu", menu);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <SectionLinkField
                          label=""
                          value={sub.url || ""}
                          onChange={(val) => {
                            const menu = [...p.menu];
                            menu[idx].submenu[sIdx] = {
                              ...menu[idx].submenu[sIdx],
                              url: val,
                            };
                            updateProp("menu", menu);
                          }}
                          sections={allSections}
                          compact
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const menu = [...p.menu];
                        menu[idx].submenu = [
                          ...(menu[idx].submenu || []),
                          { id: uuidv4(), label: "Sub Item", url: "#" },
                        ];
                        updateProp("menu", menu);
                      }}
                      className="w-full px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                    >
                      + Add Sub Item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="CTA Button">
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={p.showCta !== false}
              onChange={(e) => updateProp("showCta", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Show CTA Button</span>
          </label>
          {p.showCta !== false && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Button Text"
                value={p.ctaText || ""}
                onChange={(e) => updateProp("ctaText", e.target.value)}
                className={INPUT_CLS}
              />
              <SectionLinkField
                label="Button Link"
                value={p.ctaLink || ""}
                onChange={(v) => updateProp("ctaLink", v)}
                sections={allSections}
              />
              <LabeledField label="Style">
                <select
                  value={p.ctaStyle || "filled"}
                  onChange={(e) => updateProp("ctaStyle", e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="filled">Filled</option>
                  <option value="outline">Outline</option>
                </select>
              </LabeledField>
              <ThemeColorField
                label="Button Color"
                value={p.ctaColor || "#6366f1"}
                onChange={(v) => updateProp("ctaColor", v)}
                themeColors={themeColors}
              />
              <ThemeColorField
                label="Button Text Color"
                value={p.ctaTextColor || "#ffffff"}
                onChange={(v) => updateProp("ctaTextColor", v)}
                themeColors={themeColors}
              />
            </div>
          )}
        </SectionBlock>
      </>
    );
  };

  const renderFooterProperties = () => {
    const p = section.props;
    return (
      <>
        {renderVariantSelector()}

        <SectionBlock title="Logo & Brand">
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={p.showLogo !== false}
              onChange={(e) => updateProp("showLogo", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Show Logo</span>
          </label>
          {p.showLogo !== false && (
            <>
              {p.logo && (
                <div className="relative border-2 border-gray-200 rounded-lg p-2 mb-2">
                  <img
                    src={p.logo}
                    alt="Logo"
                    className="w-full object-contain"
                    style={{ maxHeight: `${p.logoHeight || 40}px` }}
                  />
                  <button
                    onClick={() => updateProp("logo", "")}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <FileButton
                label={p.logo ? "Change Logo" : "Upload Logo"}
                onClick={() =>
                  openFilePicker({ sectionId: section.id, field: "logo" })
                }
              />
              <div className="mt-3 space-y-3">
                <LabeledField label="Logo Height (px)">
                  <input
                    type="number"
                    value={p.logoHeight || 40}
                    min={16}
                    max={120}
                    onChange={(e) => updateProp("logoHeight", parseInt(e.target.value))}
                    className={INPUT_CLS}
                  />
                </LabeledField>
                <LabeledField label="Logo Text (fallback)">
                  <input
                    type="text"
                    value={p.logoText || ""}
                    onChange={(e) => updateProp("logoText", e.target.value)}
                    className={INPUT_CLS}
                  />
                </LabeledField>
                <ThemeColorField
                  label="Logo Text Color"
                  value={p.logoTextColor || "#ffffff"}
                  onChange={(v) => updateProp("logoTextColor", v)}
                  themeColors={themeColors}
                />
                <LabeledField label="Tagline">
                  <input
                    type="text"
                    value={p.tagline || ""}
                    onChange={(e) => updateProp("tagline", e.target.value)}
                    className={INPUT_CLS}
                  />
                </LabeledField>
                <ThemeColorField
                  label="Tagline Color"
                  value={p.taglineColor || "rgba(255,255,255,0.6)"}
                  onChange={(v) => updateProp("taglineColor", v)}
                  themeColors={themeColors}
                />
              </div>
            </>
          )}
        </SectionBlock>

        <SectionBlock title="Colors">
          <div className="space-y-4">
            <ThemeColorField
              label="Background"
              value={p.backgroundColor || "#111827"}
              onChange={(v) => updateProp("backgroundColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Text Color"
              value={p.textColor || "#ffffff"}
              onChange={(v) => updateProp("textColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Link Color"
              value={p.linkColor || "#9ca3af"}
              onChange={(v) => updateProp("linkColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Column Title Color"
              value={p.columnTitleColor || "#ffffff"}
              onChange={(v) => updateProp("columnTitleColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Accent Color"
              value={p.accentColor || "#6366f1"}
              onChange={(v) => updateProp("accentColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Divider Color"
              value={p.dividerColor || "rgba(255,255,255,0.1)"}
              onChange={(v) => updateProp("dividerColor", v)}
              themeColors={themeColors}
            />
            <ThemeColorField
              label="Copyright Color"
              value={p.copyrightColor || "rgba(255,255,255,0.4)"}
              onChange={(v) => updateProp("copyrightColor", v)}
              themeColors={themeColors}
            />
            <LabeledField label="Padding">
              <input
                type="text"
                value={p.padding || "3rem 0"}
                onChange={(e) => updateProp("padding", e.target.value)}
                placeholder="3rem 0"
                className={INPUT_CLS}
              />
            </LabeledField>
          </div>
        </SectionBlock>

        <SectionBlock
          title={`Columns (${(p.columns || []).length})`}
          action={
            <button
              onClick={() =>
                updateProp("columns", [
                  ...(p.columns || []),
                  { id: uuidv4(), title: "New Column", links: [] },
                ])
              }
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          }
        >
          <div className="space-y-3">
            {(p.columns || []).map((col, idx) => (
              <div key={col.id || idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    placeholder="Column Title"
                    value={col.title}
                    onChange={(e) => {
                      const cols = [...p.columns];
                      cols[idx] = { ...cols[idx], title: e.target.value };
                      updateProp("columns", cols);
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium"
                  />
                  <button
                    onClick={() => {
                      const cols = [...p.columns];
                      cols.splice(idx, 1);
                      updateProp("columns", cols);
                    }}
                    className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1 mt-2">
                  {(col.links || []).map((link, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      <input
                        type="text"
                        placeholder="Label"
                        value={link.label || ""}
                        onChange={(e) => {
                          const cols = [...p.columns];
                          cols[idx].links[lIdx] = {
                            ...cols[idx].links[lIdx],
                            label: e.target.value,
                          };
                          updateProp("columns", cols);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <SectionLinkField
                        label=""
                        value={link.url || ""}
                        onChange={(val) => {
                          const cols = [...p.columns];
                          cols[idx].links[lIdx] = {
                            ...cols[idx].links[lIdx],
                            url: val,
                          };
                          updateProp("columns", cols);
                        }}
                        sections={allSections}
                        compact
                      />
                      <button
                        onClick={() => {
                          const cols = [...p.columns];
                          cols[idx].links.splice(lIdx, 1);
                          updateProp("columns", cols);
                        }}
                        className="w-full text-right text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const cols = [...p.columns];
                      cols[idx].links = [
                        ...(cols[idx].links || []),
                        { id: uuidv4(), label: "Link", url: "#" },
                      ];
                      updateProp("columns", cols);
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

        <SectionBlock title="Newsletter">
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={p.showNewsletter || false}
              onChange={(e) => updateProp("showNewsletter", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="text-sm text-gray-700">
              Show Newsletter Signup
            </span>
          </label>
          {p.showNewsletter && p.newsletter && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Section title"
                value={p.newsletter.title || ""}
                onChange={(e) =>
                  updateProp("newsletter", {
                    ...p.newsletter,
                    title: e.target.value,
                  })
                }
                className={INPUT_CLS}
              />
              <input
                type="text"
                placeholder="Placeholder text"
                value={p.newsletter.placeholder || ""}
                onChange={(e) =>
                  updateProp("newsletter", {
                    ...p.newsletter,
                    placeholder: e.target.value,
                  })
                }
                className={INPUT_CLS}
              />
              <input
                type="text"
                placeholder="Button text"
                value={p.newsletter.buttonText || ""}
                onChange={(e) =>
                  updateProp("newsletter", {
                    ...p.newsletter,
                    buttonText: e.target.value,
                  })
                }
                className={INPUT_CLS}
              />
              <LabeledField label="Success Message">
                <input
                  type="text"
                  value={p.newsletter.successMessage || ""}
                  onChange={(e) =>
                    updateProp("newsletter", {
                      ...p.newsletter,
                      successMessage: e.target.value,
                    })
                  }
                  className={INPUT_CLS}
                />
              </LabeledField>
              <LabeledField label="Error Message">
                <input
                  type="text"
                  value={p.newsletter.errorMessage || ""}
                  onChange={(e) =>
                    updateProp("newsletter", {
                      ...p.newsletter,
                      errorMessage: e.target.value,
                    })
                  }
                  className={INPUT_CLS}
                />
              </LabeledField>
            </div>
          )}
        </SectionBlock>

        <SectionBlock
          title={`Social Links (${(p.socialLinks || []).length})`}
          action={
            <button
              onClick={() =>
                updateProp("socialLinks", [
                  ...(p.socialLinks || []),
                  { id: uuidv4(), platform: "Twitter", url: "#" },
                ])
              }
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          }
        >
          <div className="space-y-2">
            {(p.socialLinks || []).map((social, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Platform"
                    value={social.platform}
                    onChange={(e) => {
                      const links = [...(p.socialLinks || [])];
                      links[idx] = { ...links[idx], platform: e.target.value };
                      updateProp("socialLinks", links);
                    }}
                    className="w-1/3 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={social.url || ""}
                    onChange={(e) => {
                      const links = [...(p.socialLinks || [])];
                      links[idx] = { ...links[idx], url: e.target.value };
                      updateProp("socialLinks", links);
                    }}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      const links = [...(p.socialLinks || [])];
                      links.splice(idx, 1);
                      updateProp("socialLinks", links);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Copyright">
          <textarea
            value={p.copyright || ""}
            rows={2}
            onChange={(e) => updateProp("copyright", e.target.value)}
            placeholder={`© ${new Date().getFullYear()} Brand. All rights reserved.`}
            className={INPUT_CLS}
          />
        </SectionBlock>
      </>
    );
  };

  const isHeader = section.type === SECTION_TYPES.HEADER;
  const isFooter = section.type === SECTION_TYPES.FOOTER;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <PanelHeader
        title={
          isHeader
            ? "Header Settings"
            : isFooter
              ? "Footer Settings"
              : "Section Properties"
        }
        subtitle={
          !isHeader && !isFooter
            ? `${section.type} section${section.props.carousel?.enabled ? " • Carousel" : ""}`
            : undefined
        }
        onClose={() => selectSection(null)}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {isHeader && renderHeaderProperties()}
        {isFooter && renderFooterProperties()}

        {!isHeader && !isFooter && (
          <>
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

            {renderVariantSelector()}

            <SectionBlock title="Section Style">
              <div className="space-y-4">
                <LabeledField label="Background Type">
                  <select
                    value={section.style?.backgroundType || "color"}
                    onChange={(e) =>
                      updateStyle("backgroundType", e.target.value)
                    }
                    className={INPUT_CLS}
                  >
                    <option value="color">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image</option>
                  </select>
                </LabeledField>
                {(!section.style?.backgroundType ||
                  section.style.backgroundType === "color") && (
                  <ThemeColorField
                    label="Background Color"
                    value={section.style?.backgroundColor || "#ffffff"}
                    onChange={(v) => updateStyle("backgroundColor", v)}
                    themeColors={themeColors}
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
                            updateStyle(
                              "backgroundOverlay",
                              e.target.value / 100,
                            )
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

            {renderCarouselSettings()}

            <SectionBlock title="Content">
              {section.props.heading !== undefined &&
                renderInput("Heading", section.props.heading, (v) =>
                  updateProp("heading", v),
                )}
              {"headingColor" in section.props && (
                <ThemeColorField
                  label="Heading Color"
                  value={section.props.headingColor || "#111827"}
                  onChange={(v) => updateProp("headingColor", v)}
                  themeColors={themeColors}
                />
              )}
              {section.props.subheading !== undefined &&
                renderInput(
                  "Subheading",
                  section.props.subheading,
                  (v) => updateProp("subheading", v),
                  "textarea",
                )}
              {"subheadingColor" in section.props && (
                <ThemeColorField
                  label="Subheading Color"
                  value={section.props.subheadingColor || "#6b7280"}
                  onChange={(v) => updateProp("subheadingColor", v)}
                  themeColors={themeColors}
                />
              )}
              {section.props.content !== undefined &&
                renderInput(
                  "Content (HTML)",
                  section.props.content,
                  (v) => updateProp("content", v),
                  "textarea",
                )}
              {"contentColor" in section.props && (
                <ThemeColorField
                  label="Content Color"
                  value={section.props.contentColor || "#374151"}
                  onChange={(v) => updateProp("contentColor", v)}
                  themeColors={themeColors}
                />
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
              {"ctaColor" in section.props && (
                <ThemeColorField
                  label="CTA Button Color"
                  value={section.props.ctaColor || "#6366f1"}
                  onChange={(v) => updateProp("ctaColor", v)}
                  themeColors={themeColors}
                />
              )}
              {"ctaTextColor" in section.props && (
                <ThemeColorField
                  label="CTA Text Color"
                  value={section.props.ctaTextColor || "#ffffff"}
                  onChange={(v) => updateProp("ctaTextColor", v)}
                  themeColors={themeColors}
                />
              )}
              {section.props.ctaLink !== undefined && (
                <SectionLinkField
                  label="CTA Link"
                  value={section.props.ctaLink || ""}
                  onChange={(v) => updateProp("ctaLink", v)}
                  sections={allSections}
                />
              )}
              {section.props.secondaryCtaText !== undefined &&
                renderInput(
                  "Secondary CTA Text",
                  section.props.secondaryCtaText,
                  (v) => updateProp("secondaryCtaText", v),
                )}
              {"secondaryCtaBorderColor" in section.props && (
                <ThemeColorField
                  label="Secondary CTA Border"
                  value={section.props.secondaryCtaBorderColor || "#e5e7eb"}
                  onChange={(v) => updateProp("secondaryCtaBorderColor", v)}
                  themeColors={themeColors}
                />
              )}
              {"secondaryCtaTextColor" in section.props && (
                <ThemeColorField
                  label="Secondary CTA Text Color"
                  value={section.props.secondaryCtaTextColor || "#374151"}
                  onChange={(v) => updateProp("secondaryCtaTextColor", v)}
                  themeColors={themeColors}
                />
              )}
              {section.props.secondaryCtaLink !== undefined && (
                <SectionLinkField
                  label="Secondary CTA Link"
                  value={section.props.secondaryCtaLink || ""}
                  onChange={(v) => updateProp("secondaryCtaLink", v)}
                  sections={allSections}
                />
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
                typeof section.props.columns === "number" &&
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
                    <SectionLinkField
                      label="Link"
                      value={section.props.primaryButton?.link || "#"}
                      onChange={(v) => updateProp("primaryButton.link", v)}
                      sections={allSections}
                    />
                    <ThemeColorField
                      label="Background"
                      value={section.props.primaryButton?.backgroundColor || "#ffffff"}
                      onChange={(v) => updateProp("primaryButton.backgroundColor", v)}
                      themeColors={themeColors}
                    />
                    <div className="mt-2">
                      <ThemeColorField
                        label="Text Color"
                        value={section.props.primaryButton?.textColor || "#6366f1"}
                        onChange={(v) => updateProp("primaryButton.textColor", v)}
                        themeColors={themeColors}
                      />
                    </div>
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
                    <SectionLinkField
                      label="Link"
                      value={section.props.secondaryButton?.link || "#"}
                      onChange={(v) => updateProp("secondaryButton.link", v)}
                      sections={allSections}
                    />
                    <ThemeColorField
                      label="Border Color"
                      value={section.props.secondaryButton?.borderColor || "#ffffff"}
                      onChange={(v) => updateProp("secondaryButton.borderColor", v)}
                      themeColors={themeColors}
                    />
                    <div className="mt-2">
                      <ThemeColorField
                        label="Text Color"
                        value={section.props.secondaryButton?.textColor || "#ffffff"}
                        onChange={(v) => updateProp("secondaryButton.textColor", v)}
                        themeColors={themeColors}
                      />
                    </div>
                  </div>
                </>
              )}

              {section.props.submitText !== undefined &&
                renderInput(
                  "Submit Button Text",
                  section.props.submitText,
                  (v) => updateProp("submitText", v),
                )}
              {section.props.placeholder !== undefined &&
                renderInput(
                  "Placeholder Text",
                  section.props.placeholder,
                  (v) => updateProp("placeholder", v),
                )}
              {section.props.buttonText !== undefined &&
                renderInput("Button Text", section.props.buttonText, (v) =>
                  updateProp("buttonText", v),
                )}
            </SectionBlock>

            {"iconBackground" in section.props && (
              <SectionBlock title="Colors">
                <div className="space-y-3">
                  {"iconBackground" in section.props && (
                    <ThemeColorField
                      label="Icon Background"
                      value={section.props.iconBackground || "#6366f1"}
                      onChange={(v) => updateProp("iconBackground", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"iconColor" in section.props && (
                    <ThemeColorField
                      label="Icon Color"
                      value={section.props.iconColor || "#ffffff"}
                      onChange={(v) => updateProp("iconColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"cardBackground" in section.props && (
                    <ThemeColorField
                      label="Card Background"
                      value={section.props.cardBackground || "#ffffff"}
                      onChange={(v) => updateProp("cardBackground", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"cardBorderColor" in section.props && (
                    <ThemeColorField
                      label="Card Border Color"
                      value={section.props.cardBorderColor || "#f3f4f6"}
                      onChange={(v) => updateProp("cardBorderColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"titleColor" in section.props && (
                    <ThemeColorField
                      label="Title Color"
                      value={section.props.titleColor || "#111827"}
                      onChange={(v) => updateProp("titleColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"descriptionColor" in section.props && (
                    <ThemeColorField
                      label="Description Color"
                      value={section.props.descriptionColor || "#6b7280"}
                      onChange={(v) => updateProp("descriptionColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"metricColor" in section.props && (
                    <ThemeColorField
                      label="Metric Color"
                      value={section.props.metricColor || "#6366f1"}
                      onChange={(v) => updateProp("metricColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"valueColor" in section.props && (
                    <ThemeColorField
                      label="Value Color"
                      value={section.props.valueColor || "#6366f1"}
                      onChange={(v) => updateProp("valueColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"labelColor" in section.props && (
                    <ThemeColorField
                      label="Label Color"
                      value={section.props.labelColor || "#111827"}
                      onChange={(v) => updateProp("labelColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"quoteColor" in section.props && (
                    <ThemeColorField
                      label="Quote Color"
                      value={section.props.quoteColor || "#374151"}
                      onChange={(v) => updateProp("quoteColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"nameColor" in section.props && (
                    <ThemeColorField
                      label="Name Color"
                      value={section.props.nameColor || "#111827"}
                      onChange={(v) => updateProp("nameColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"roleColor" in section.props && (
                    <ThemeColorField
                      label="Role Color"
                      value={section.props.roleColor || "#6366f1"}
                      onChange={(v) => updateProp("roleColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"starColor" in section.props && (
                    <ThemeColorField
                      label="Star Color"
                      value={section.props.starColor || "#f59e0b"}
                      onChange={(v) => updateProp("starColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"bioColor" in section.props && (
                    <ThemeColorField
                      label="Bio Color"
                      value={section.props.bioColor || "#6b7280"}
                      onChange={(v) => updateProp("bioColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"buttonColor" in section.props && (
                    <ThemeColorField
                      label="Button Color"
                      value={section.props.buttonColor || "#6366f1"}
                      onChange={(v) => updateProp("buttonColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"buttonTextColor" in section.props && (
                    <ThemeColorField
                      label="Button Text Color"
                      value={section.props.buttonTextColor || "#ffffff"}
                      onChange={(v) => updateProp("buttonTextColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"highlightColor" in section.props && (
                    <ThemeColorField
                      label="Highlight Color"
                      value={section.props.highlightColor || "#6366f1"}
                      onChange={(v) => updateProp("highlightColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"checkColor" in section.props && (
                    <ThemeColorField
                      label="Check Icon Color"
                      value={section.props.checkColor || "#22c55e"}
                      onChange={(v) => updateProp("checkColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"badgeBackground" in section.props && (
                    <ThemeColorField
                      label="Badge Background"
                      value={section.props.badgeBackground || "#6366f1"}
                      onChange={(v) => updateProp("badgeBackground", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"badgeTextColor" in section.props && (
                    <ThemeColorField
                      label="Badge Text Color"
                      value={section.props.badgeTextColor || "#ffffff"}
                      onChange={(v) => updateProp("badgeTextColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"inputBackground" in section.props && (
                    <ThemeColorField
                      label="Input Background"
                      value={section.props.inputBackground || "rgba(255,255,255,0.1)"}
                      onChange={(v) => updateProp("inputBackground", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"inputBorderColor" in section.props && (
                    <ThemeColorField
                      label="Input Border"
                      value={section.props.inputBorderColor || "#e5e7eb"}
                      onChange={(v) => updateProp("inputBorderColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                  {"benefitColor" in section.props && (
                    <ThemeColorField
                      label="Benefit Text Color"
                      value={section.props.benefitColor || "rgba(255,255,255,0.75)"}
                      onChange={(v) => updateProp("benefitColor", v)}
                      themeColors={themeColors}
                    />
                  )}
                </div>
              </SectionBlock>
            )}

            {(section.props.submitText !== undefined ||
              section.props.buttonText !== undefined) && (
              <SectionBlock
                title="Form Submission"
                icon={<Link className="w-4 h-4 text-indigo-500" />}
              >
                <div className="space-y-3">
                  {section.props.successMessage !== undefined && (
                    <LabeledField label="Success Message">
                      <input
                        type="text"
                        value={section.props.successMessage || ""}
                        onChange={(e) =>
                          updateProp("successMessage", e.target.value)
                        }
                        className={INPUT_CLS}
                      />
                    </LabeledField>
                  )}
                  {section.props.errorMessage !== undefined && (
                    <LabeledField label="Error Message">
                      <input
                        type="text"
                        value={section.props.errorMessage || ""}
                        onChange={(e) =>
                          updateProp("errorMessage", e.target.value)
                        }
                        className={INPUT_CLS}
                      />
                    </LabeledField>
                  )}
                </div>
              </SectionBlock>
            )}

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
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={item.icon || ""}
                      onChange={(e) => update("icon", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={2}
                    />
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
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={item.icon || ""}
                      onChange={(e) => update("icon", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Metric"
                      value={item.metric || ""}
                      onChange={(e) => update("metric", e.target.value)}
                      className={INPUT_CLS}
                    />
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
                    <input
                      type="text"
                      placeholder="Value"
                      value={item.value || ""}
                      onChange={(e) => update("value", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={item.label || ""}
                      onChange={(e) => update("label", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={INPUT_CLS}
                    />
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
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={item.icon || ""}
                      onChange={(e) => update("icon", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={item.number || ""}
                      onChange={(e) => update("number", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={item.duration || ""}
                      onChange={(e) => update("duration", e.target.value)}
                      className={INPUT_CLS}
                    />
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
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <div className="mb-3">
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
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={item.role || ""}
                      onChange={(e) => update("role", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Content"
                      value={item.content || ""}
                      onChange={(e) => update("content", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={3}
                    />
                    <div className="mb-3">
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
                    <input
                      type="number"
                      placeholder="Rating (1-5)"
                      value={item.rating || 5}
                      min={1}
                      max={5}
                      onChange={(e) =>
                        update("rating", parseInt(e.target.value))
                      }
                      className={`${INPUT_CLS} mb-2`}
                    />
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
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={item.price || ""}
                      onChange={(e) => update("price", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Period"
                      value={item.period || ""}
                      onChange={(e) => update("period", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="CTA Text"
                      value={item.ctaText || ""}
                      onChange={(e) => update("ctaText", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <SectionLinkField
                      label="CTA Link"
                      value={item.ctaLink || "#"}
                      onChange={(v) => update("ctaLink", v)}
                      sections={allSections}
                    />
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
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.highlighted || false}
                        onChange={(e) =>
                          update("highlighted", e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">
                        Highlighted Plan
                      </span>
                    </label>
                    {item.highlighted && (
                      <input
                        type="text"
                        placeholder="Badge Text"
                        value={item.badge || ""}
                        onChange={(e) => update("badge", e.target.value)}
                        className={`${INPUT_CLS} mb-2`}
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Savings Tag"
                      value={item.savings || ""}
                      onChange={(e) => update("savings", e.target.value)}
                      className={INPUT_CLS}
                    />
                  </>
                ),
              )}
            {section.props.fields &&
              renderArrayEditor(
                "Form Fields",
                "fields",
                {
                  type: "text",
                  label: "Field Label",
                  placeholder: "",
                  required: false,
                },
                (item, idx, update) => (
                  <>
                    <input
                      type="text"
                      placeholder="Label"
                      value={item.label || ""}
                      onChange={(e) => update("label", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Placeholder"
                      value={item.placeholder || ""}
                      onChange={(e) => update("placeholder", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <select
                      value={item.type || "text"}
                      onChange={(e) => update("type", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="textarea">Textarea</option>
                    </select>
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
                    <input
                      type="text"
                      placeholder="Question"
                      value={item.question || ""}
                      onChange={(e) => update("question", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Answer"
                      value={item.answer || ""}
                      onChange={(e) => update("answer", e.target.value)}
                      className={INPUT_CLS}
                      rows={3}
                    />
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
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={item.role || ""}
                      onChange={(e) => update("role", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Bio"
                      value={item.bio || ""}
                      onChange={(e) => update("bio", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={2}
                    />
                    <div className="mb-3">
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
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Client"
                      value={item.client || ""}
                      onChange={(e) => update("client", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                      rows={2}
                    />
                    <SectionLinkField
                      label="Link"
                      value={item.link || "#"}
                      onChange={(v) => update("link", v)}
                      sections={allSections}
                    />
                    <div className="mb-3">
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
                    <div className="mb-2">
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
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={item.icon || ""}
                      onChange={(e) => update("icon", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={INPUT_CLS}
                    />
                  </>
                ),
              )}
            {section.props.awards !== undefined && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    Awards ({(section.props.awards || []).length})
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
            {section.props.items &&
              section.type === "gallery" &&
              renderArrayEditor(
                "Gallery Items",
                "items",
                { image: "", title: "New Item", category: "", description: "" },
                (item, idx, update) => (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title || ""}
                      onChange={(e) => update("title", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={item.category || ""}
                      onChange={(e) => update("category", e.target.value)}
                      className={`${INPUT_CLS} mb-2`}
                    />
                    <div className="mb-3">
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
                    <textarea
                      placeholder="Description"
                      value={item.description || ""}
                      onChange={(e) => update("description", e.target.value)}
                      className={INPUT_CLS}
                      rows={2}
                    />
                  </>
                ),
              )}
          </>
        )}
      </div>

      {showFilePicker && selectedWebsite?.id && (
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
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function ThemeColorField({ label, value, onChange, themeColors }) {
  const [showPicker, setShowPicker] = useState(false);

  const colorEntries = Object.entries(themeColors || {}).filter(
    ([, v]) => v && typeof v === "string",
  );

  const colorNames = {
    primary: "Primary",
    secondary: "Secondary",
    accent: "Accent",
    background: "Background",
    text: "Text",
  };

  return (
    <LabeledField label={label}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="color"
            value={value && value.startsWith("#") ? value : "#6366f1"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        {colorEntries.length > 0 && (
          <div>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${showPicker ? "rotate-180" : ""}`} />
              {showPicker ? "Hide" : "Use"} theme color
            </button>
            {showPicker && (
              <div className="mt-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                {colorEntries.map(([key, colorVal]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onChange(colorVal);
                      setShowPicker(false);
                    }}
                    title={`${colorNames[key] || key}: ${colorVal}`}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white hover:border-indigo-400 hover:shadow-sm transition-all text-xs text-gray-700"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: colorVal }}
                    />
                    {colorNames[key] || key}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </LabeledField>
  );
}

function SectionLinkField({ label, value, onChange, sections, compact }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const nonStructural = sections.filter(
    (s) => s.type !== "header" && s.type !== "footer",
  );

  const getSectionLabel = (s) => {
    const heading = s.props?.heading || s.props?.title || "";
    return heading
      ? `${s.type} — ${heading.slice(0, 30)}`
      : `${s.type} (${s.id.slice(-6)})`;
  };

  return (
    <div className="mb-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex gap-1">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL or #section-id"
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${compact ? "text-xs py-1" : ""}`}
        />
        {nonStructural.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              title="Link to section"
              className="h-full px-2 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center"
            >
              <Hash className="w-4 h-4 text-gray-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                    Jump to section
                  </p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {nonStructural.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onChange(`#${s.id}`);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                      <span className="truncate">{getSectionLabel(s)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <LabeledField label={label}>
      <div className="flex gap-2">
        <input
          type="color"
          value={value && value.startsWith("#") ? value : "#6366f1"}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value || ""}
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