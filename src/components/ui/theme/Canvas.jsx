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

export default function Canvas({ selectedTemplate }) {
  const { config, reorderSections, selectSection } = useEditorStore();
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

  return (
    <div className="w-full bg-white min-h-full">
      <div className="w-full">
        {sections.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your canvas is empty</h3>
              <p className="text-sm text-gray-500">Add sections from the library on the left. Start with a Header!</p>
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
      </div>
    </div>
  );
}