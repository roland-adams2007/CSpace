import { SECTION_LIBRARY } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";

export default function SectionLibrary({ onAddSection }) {
  const getIcon = (iconName) => {
    const IconComponent = LucideIcons[
      iconName.split("-").map((word, i) =>
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join("")
    ];
    return IconComponent || LucideIcons.Box;
  };

  const categories = [
    { name: "Hero Sections", types: ["hero"], icon: "layout" },
    { name: "Features & Benefits", types: ["features", "stats"], icon: "zap" },
    { name: "Content & Media", types: ["content", "gallery"], icon: "image" },
    { name: "Social Proof", types: ["testimonials", "team"], icon: "users" },
    { name: "Conversion", types: ["cta", "pricing", "contact", "newsletter"], icon: "target" },
    { name: "Information", types: ["faq", "process", "benefits", "logos"], icon: "info" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <LucideIcons.Plus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Add Sections
            </h3>
            <p className="text-xs text-gray-600">Click to add to canvas</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {categories.map((category) => {
          const items = SECTION_LIBRARY.filter((item) =>
            category.types.includes(item.type)
          );
          if (items.length === 0) return null;

          const CategoryIcon = getIcon(category.icon);

          return (
            <div key={category.name}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                  <CategoryIcon className="w-4 h-4 text-gray-600" />
                </div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {category.name}
                </h4>
              </div>
              
              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onAddSection(item)}
                      className="w-full group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
                      <div className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all bg-white">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-indigo-100 group-hover:to-purple-100 transition-all flex-shrink-0 shadow-sm">
                          <Icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.type} section
                          </p>
                        </div>
                        <LucideIcons.Plus className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-6 pb-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <LucideIcons.Lightbulb className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-1">Pro Tip</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Start with a hero section, add features, then finish with a strong call-to-action for best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}