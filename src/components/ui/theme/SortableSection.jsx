import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, Eye, MoreVertical } from "lucide-react";
import { useEditorStore } from "../../../store/store";
import SectionRenderer from "./SectionRenderer";
import { useState, useRef, useEffect } from "react";
import { SECTION_TYPES } from "../../../utils/sectionLibrary";

export default function SortableSection({ section, onSelect, themeColors }) {
  const { deleteSection, selectedSection, updateSection } = useEditorStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const isSelected = selectedSection === section.id;
  const isStructural = section.type === SECTION_TYPES.HEADER || section.type === SECTION_TYPES.FOOTER;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDuplicate = (e) => {
    e.stopPropagation();
    const newSection = { ...section, id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    const { config, reorderSections } = useEditorStore.getState();
    const idx = config.layout.sections.findIndex((s) => s.id === section.id);
    const newSections = [...config.layout.sections];
    newSections.splice(idx + 1, 0, newSection);
    reorderSections(newSections);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const label = isStructural ? section.type.charAt(0).toUpperCase() + section.type.slice(1) : "section";
    if (confirm(`Are you sure you want to delete this ${label}?`)) deleteSection(section.id);
    setShowMenu(false);
  };

  const toggleVisibility = (e) => {
    e.stopPropagation();
    updateSection(section.id, { props: { ...section.props, hidden: !section.props.hidden } });
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${section.props.hidden ? "opacity-50" : ""} ${isSelected ? "ring-2 ring-inset ring-indigo-500" : ""}`}
      onClick={onSelect}
    >
      {/* SectionRenderer first — controls come AFTER in DOM so they paint on top */}
      <SectionRenderer section={section} themeColors={themeColors} />

      {/* Controls — inline z-index 9999 to beat header's z-index:50 stacking context */}
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        style={{ zIndex: 9999, pointerEvents: "auto" }}
      >
        <button
            {...attributes}
            {...listeners}
            className="p-1.5 bg-white/90 backdrop-blur border border-gray-300 rounded-md shadow-sm hover:bg-white cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5 text-gray-600" />
          </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 bg-white/90 backdrop-blur border border-gray-300 rounded-md shadow-sm hover:bg-white transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[140px]"
              style={{ zIndex: 9999 }}
            >
              <button onClick={toggleVisibility} className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                <Eye className={`w-4 h-4 ${section.props.hidden ? "text-gray-400" : "text-gray-600"}`} />
                <span className="text-gray-700">{section.props.hidden ? "Show" : "Hide"}</span>
              </button>
              {!isStructural && (
                <button onClick={handleDuplicate} className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Duplicate</span>
                </button>
              )}
              <div className="border-t border-gray-100 my-1" />
              <button onClick={handleDelete} className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}