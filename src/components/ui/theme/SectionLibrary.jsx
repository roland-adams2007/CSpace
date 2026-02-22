import { SECTION_LIBRARY } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";

const CATEGORIES = [
  { name: "Hero", types: ["hero"], icon: "layout" },
  { name: "Features & Benefits", types: ["features", "benefits"], icon: "zap" },
  { name: "Stats & Process", types: ["stats", "process"], icon: "bar-chart" },
  { name: "Content & Media", types: ["content", "gallery"], icon: "image" },
  { name: "Social Proof", types: ["testimonials", "team", "case-studies"], icon: "users" },
  { name: "Trust & Logos", types: ["logos", "trust"], icon: "shield" },
  { name: "Conversion", types: ["cta", "pricing", "contact", "newsletter"], icon: "target" },
  { name: "Information", types: ["faq"], icon: "help-circle" },
];

const getIcon = (iconName) => {
  if (!iconName) return LucideIcons.Box;
  const pascal = iconName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return LucideIcons[pascal] || LucideIcons.Box;
};

export default function SectionLibrary({ onAddSection }) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
            <LucideIcons.Plus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Add Sections</h3>
            <p className="text-xs text-gray-500">Click to add to canvas</p>
          </div>
        </div>
      </div>

      {/* Section list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {CATEGORIES.map((cat) => {
          const items = SECTION_LIBRARY.filter((item) =>
            cat.types.includes(item.type)
          );
          if (items.length === 0) return null;
          const CatIcon = getIcon(cat.icon);

          return (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <CatIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {cat.name}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onAddSection(item)}
                      className="w-full group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-indigo-400 hover:shadow-md transition-all bg-white">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {item.type} section
                          </p>
                        </div>
                        <LucideIcons.Plus className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Tip */}
        <div className="pb-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-start gap-2">
              <LucideIcons.Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">Pro Tip</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Start with a Hero, add Features, build trust with Stats & Testimonials, then close with a strong CTA. Use the Properties panel to switch layout variants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}