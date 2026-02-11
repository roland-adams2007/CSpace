import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, Eye, MoreVertical } from "lucide-react";
import { useEditorStore } from "../../../store/store";
import SectionRenderer from "./SectionRenderer";
import { useState, useRef, useEffect } from "react";

export default function SortableSection({ section, onSelect, themeColors }) {
  const { deleteSection, selectedSection, updateSection } = useEditorStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedSection === section.id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDuplicate = (e) => {
    e.stopPropagation();
    const newSection = {
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    const { config, reorderSections } = useEditorStore.getState();
    const sectionIndex = config.layout.sections.findIndex(
      (s) => s.id === section.id,
    );
    const newSections = [...config.layout.sections];
    newSections.splice(sectionIndex + 1, 0, newSection);
    reorderSections(newSections);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this section?")) {
      deleteSection(section.id);
    }
    setShowMenu(false);
  };

  const toggleVisibility = (e) => {
    e.stopPropagation();
    updateSection(section.id, {
      props: {
        ...section.props,
        hidden: !section.props.hidden,
      },
    });
    setShowMenu(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${section.props.hidden ? "opacity-50" : ""} ${
        isSelected ? "ring-2 ring-indigo-500" : ""
      }`}
      onClick={onSelect}
    >
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-1">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute left-full top-0 ml-1 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[140px] z-30">
              <button
                onClick={toggleVisibility}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye
                  className={`w-4 h-4 ${section.props.hidden ? "text-gray-400" : "text-gray-600"}`}
                />
                <span>{section.props.hidden ? "Show" : "Hide"}</span>
              </button>
              <button
                onClick={handleDuplicate}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-gray-600" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={isSelected ? "ring-2 ring-indigo-500 ring-inset" : ""}>
        <SectionRenderer section={section} themeColors={themeColors} />
      </div>
    </div>
  );
}
