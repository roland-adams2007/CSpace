import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "../../../store/store";
import SortableSection from "./SortableSection";
import { Inbox, Menu as MenuIcon, X } from "lucide-react";

export default function Canvas({ selectedTemplate }) {
  const { config, reorderSections, selectSection, selectHeader, selectFooter } =
    useEditorStore();
  const sections = config.layout?.sections || [];
  const themeColors = config.theme?.colors;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const getHeaderStyle = () => {
    const style = {
      height: config.header?.style?.height || "80px",
      backgroundColor: config.header?.style?.backgroundColor || "#ffffff",
    };
    if (config.header?.style?.sticky) {
      style.position = "sticky";
      style.top = "0";
      style.zIndex = "50";
    }
    style.borderBottom = "1px solid #e5e7eb";
    return style;
  };

  const getFooterStyle = () => ({
    backgroundColor: config.footer?.style?.backgroundColor || "#111827",
    color: config.footer?.style?.textColor || "#ffffff",
    padding: config.footer?.style?.padding || "3rem 0",
  });

  const handleNavClick = (e, url) => {
    e.preventDefault();
    if (url?.startsWith("#")) {
      const el = document.getElementById(url.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="w-full">
        {/* ── Header ── */}
        <div
          style={getHeaderStyle()}
          className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all relative"
          onClick={() => selectHeader()}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              {config.header?.props?.logo ? (
                <a href="/" className="flex-shrink-0" onClick={(e) => e.preventDefault()}>
                  <img src={config.header.props.logo} alt="Logo" className="h-10 object-contain" />
                </a>
              ) : (
                <a href="/" className="text-lg font-bold text-gray-900" onClick={(e) => e.preventDefault()}>
                  Logo
                </a>
              )}

              <div className="md:hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
                  className="p-2 text-gray-700 hover:text-gray-900"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {(config.header?.props?.menu || []).map((item, idx) => (
                <a key={idx} href={item.link || item.url}
                  onClick={(e) => handleNavClick(e, item.link || item.url)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {config.header?.props?.ctaButton?.text && (
                <a
                  href={config.header.props.ctaButton.link}
                  onClick={(e) => handleNavClick(e, config.header.props.ctaButton.link)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
                >
                  {config.header.props.ctaButton.text}
                </a>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 p-4">
              <div className="flex flex-col space-y-3">
                {(config.header?.props?.menu || []).map((item, idx) => (
                  <a key={idx} href={item.link || item.url}
                    onClick={(e) => handleNavClick(e, item.link || item.url)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 px-4 hover:bg-gray-50 rounded">
                    {item.label}
                  </a>
                ))}
                {config.header?.props?.ctaButton?.text && (
                  <a
                    href={config.header.props.ctaButton.link}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-center"
                    style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
                  >
                    {config.header.props.ctaButton.text}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Canvas body ── */}
        {sections.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your canvas is empty</h3>
              <p className="text-sm text-gray-500">Add sections from the library or choose a template</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-template-modal"))}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Choose Template
              </button>
            </div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div>
                {sections.map((section) => (
                  <div key={section.id} id={section.id}>
                    <SortableSection
                      section={section}
                      onSelect={() => selectSection(section.id)}
                      themeColors={themeColors}
                      selectedTemplate={selectedTemplate}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* ── Footer ── */}
        <div
          style={getFooterStyle()}
          className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
          onClick={() => selectFooter()}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid gap-8 mb-8 ${
              (config.footer?.props?.columns?.length || 0) <= 1 ? "grid-cols-1"
              : (config.footer?.props?.columns?.length || 0) === 2 ? "grid-cols-1 md:grid-cols-2"
              : (config.footer?.props?.columns?.length || 0) === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}>
              {(config.footer?.props?.columns || []).map((column, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold mb-4 text-lg">{column.title}</h4>
                  <ul className="space-y-3">
                    {(column.links || []).map((link, lIdx) => (
                      <li key={lIdx}>
                        <a href={link.link || link.url || "#"}
                          onClick={(e) => handleNavClick(e, link.link || link.url || "#")}
                          className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                          {link.label || link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {config.footer?.props?.newsletter && (
                <div className="col-span-full mt-4">
                  <h4 className="font-semibold mb-4 text-lg">{config.footer.props.newsletter.title}</h4>
                  <div className="flex gap-2 max-w-md">
                    <input type="email" placeholder={config.footer.props.newsletter.placeholder}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
                    <button
                      className="px-6 py-2 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
                    >
                      {config.footer.props.newsletter.buttonText}
                    </button>
                  </div>
                </div>
              )}

              {config.footer?.props?.socialLinks?.length > 0 && (
                <div className="col-span-full mt-4">
                  <div className="flex gap-4">
                    {config.footer.props.socialLinks.map((social, idx) => (
                      <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer"
                        className="opacity-80 hover:opacity-100 transition-opacity text-sm font-medium">
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {config.footer?.props?.copyright && (
              <div
                className="pt-6 border-t border-opacity-20 text-center text-sm opacity-70"
                style={{ borderColor: config.footer?.style?.textColor || "#ffffff" }}
              >
                {config.footer.props.copyright}
              </div>
            )}

            {/* CreatorSpace attribution */}
            <div
              className="pt-4 text-center text-xs opacity-40 hover:opacity-70 transition-opacity"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "1rem", paddingTop: "1rem" }}
            >
              Made with{" "}
              <a
                href={import.meta.env.VITE_APP_URL || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                CreatorSpace
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}