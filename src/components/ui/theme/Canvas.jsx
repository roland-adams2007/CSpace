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
import SectionRenderer from "./SectionRenderer"; // make sure this import exists
import { Inbox } from "lucide-react";

export default function Canvas({ selectedTemplate }) {
  const { config, reorderSections, selectSection, selectedSection } = useEditorStore();
  const sections = config.layout?.sections || [];
  const themeColors = config.theme?.colors;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    reorderSections(arrayMove(sections, oldIndex, newIndex));
  };

  // Separate structural sections (header/footer) from sortable body sections
  // Header and footer must NOT be inside dnd-kit's transform context — CSS transform
  // breaks position:sticky, which is a browser-level limitation.
  const headerSection = sections.find((s) => s.type === "header");
  const footerSection = sections.find((s) => s.type === "footer");
  const bodySections = sections.filter(
    (s) => s.type !== "header" && s.type !== "footer"
  );

  const renderStaticSection = (section) => (
    <div
      key={section.id}
      id={section.id}
      // Sticky needs to be on THIS element so it sticks within the canvas scroll container
      style={
        section.type === "header" && section.props?.sticky !== false
          ? { position: "sticky", top: 0, zIndex: 50 }
          : undefined
      }
      onClick={() => selectSection(section.id)}
      className={`relative cursor-pointer transition-all ${
        selectedSection === section.id
          ? "ring-2 ring-inset ring-indigo-500"
          : "hover:ring-2 hover:ring-inset hover:ring-indigo-200"
      }`}
    >
      <SectionRenderer
        section={section}
        themeColors={themeColors}
        isPreview={false}
      />
    </div>
  );

  return (
    <div className="w-full bg-white min-h-full">
      <div className="w-full">
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
                Add sections from the library on the left. Start with a Header!
              </p>
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-template-modal"))
                }
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Choose Template
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header rendered OUTSIDE DndContext so sticky works (transforms break sticky) */}
            {headerSection && renderStaticSection(headerSection)}

            {/* Body sections are sortable */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={bodySections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {bodySections.map((section) => (
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

            {/* Footer rendered OUTSIDE DndContext too */}
            {footerSection && renderStaticSection(footerSection)}
          </>
        )}
      </div>
    </div>
  );
}