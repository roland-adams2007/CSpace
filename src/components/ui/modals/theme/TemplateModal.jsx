import React from "react";
import { X } from "lucide-react";
import { TEMPLATE_STRUCTURES } from "../../../../constants/templateStructures";

export default function TemplateModal({
  isOpen,
  onClose,
  onApplyTemplate,
  selectedTemplate,
  currentSectionsCount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose a Template
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select a template to apply to your website. This will replace your
            current layout.
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(TEMPLATE_STRUCTURES).map(([key, template]) => {
              const Icon = template.icon;
              return (
                <button
                  key={key}
                  onClick={() => onApplyTemplate(key)}
                  className={`border-2 rounded-lg p-6 text-left transition-all hover:shadow-lg ${
                    selectedTemplate === key
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedTemplate === key
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedTemplate === key ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.structure.length} sections •{" "}
                    {template.structure.filter((s) => s.type === "hero").length}{" "}
                    hero •{" "}
                    {
                      template.structure.filter((s) => s.type === "features")
                        .length
                    }{" "}
                    features
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Current Template: {TEMPLATE_STRUCTURES[selectedTemplate]?.name}
            </h4>
            <p className="text-sm text-gray-600">
              You have {currentSectionsCount} sections in your current layout.
              {currentSectionsCount > 0 && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  Warning: Applying a new template will replace all current
                  sections.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
