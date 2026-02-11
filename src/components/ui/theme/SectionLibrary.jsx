import { SECTION_LIBRARY } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";

export default function SectionLibrary({ onAddSection }) {
  const getIcon = (iconName) => {
    const IconComponent =
      LucideIcons[
        iconName
          .split("-")
          .map((word, i) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join("")
      ];

    return IconComponent || LucideIcons.Box;
  };

  const categories = [
    { name: "Hero Sections", types: ["hero"] },
    { name: "Features", types: ["features"] },
    { name: "Content", types: ["content", "gallery"] },
    { name: "Social Proof", types: ["testimonials", "team"] },
    { name: "Conversion", types: ["cta", "pricing", "contact"] },
    { name: "Support", types: ["faq"] },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Add Sections
        </h3>
        <p className="text-xs text-gray-500">Click to add to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categories.map((category) => {
          const items = SECTION_LIBRARY.filter((item) =>
            category.types.includes(item.type),
          );

          if (items.length === 0) return null;

          return (
            <div key={category.name}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {category.name}
              </h4>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);

                  return (
                    <button
                      key={item.id}
                      onClick={() => onAddSection(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.type}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}