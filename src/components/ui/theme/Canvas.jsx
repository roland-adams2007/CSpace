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
import { Inbox } from "lucide-react";

export default function Canvas() {
  const { config, reorderSections, selectSection, selectHeader, selectFooter } = useEditorStore();
  const sections = config.layout.sections;
  const themeColors = config.theme?.colors;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      reorderSections(newSections);
    }
  };

  const headerStyle = {
    height: config.header.style?.height || '80px',
    position: config.header.style?.sticky ? 'sticky' : 'relative',
    top: config.header.style?.sticky ? '0' : 'auto',
    zIndex: config.header.style?.sticky ? '50' : 'auto',
    backgroundColor: config.header.style?.backgroundColor || '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  };

  const footerStyle = {
    backgroundColor: config.footer.style?.backgroundColor || '#111827',
    color: config.footer.style?.textColor || '#ffffff',
    padding: config.footer.style?.padding || '3rem 0',
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="w-full">
        <div
          style={headerStyle}
          className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
          onClick={() => selectHeader()}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            {config.header.props.logo ? (
              <a href="/" className="flex-shrink-0">
                <img
                  src={config.header.props.logo}
                  alt="Logo"
                  className="h-10 object-contain"
                />
              </a>
            ) : (
              <a href="/" className="text-lg font-bold text-gray-900">Logo</a>
            )}
            
            <nav className="hidden md:flex items-center gap-8">
              {(config.header.props.menu || []).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {config.header.props.ctaButton?.text && (
                <a
                  href={config.header.props.ctaButton.link}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
                >
                  {config.header.props.ctaButton.text}
                </a>
              )}
            </div>
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your canvas is empty
              </h3>
              <p className="text-sm text-gray-500">
                Add sections from the library to start building
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onSelect={() => selectSection(section.id)}
                    themeColors={themeColors}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div
          style={footerStyle}
          className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
          onClick={() => selectFooter()}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid gap-8 mb-8 ${config.footer.props.columns?.length === 1 ? 'grid-cols-1' : config.footer.props.columns?.length === 2 ? 'grid-cols-1 md:grid-cols-2' : config.footer.props.columns?.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
              {(config.footer.props.columns || []).map((column, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold mb-4 text-lg">{column.title}</h4>
                  <ul className="space-y-3">
                    {(column.links || []).map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url}
                          className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {config.footer.props.copyright && (
              <div className="pt-8 border-t border-opacity-20 text-center text-sm opacity-70" style={{ borderColor: config.footer.style?.textColor || "#ffffff" }}>
                {config.footer.props.copyright}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}