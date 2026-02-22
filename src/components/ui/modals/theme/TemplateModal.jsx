import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Layout, Check, Sparkles } from "lucide-react";

export default function TemplateModal({ 
  isOpen, 
  onClose, 
  onApplyTemplate, 
  selectedTemplate,
  templates,
  currentSectionsCount 
}) {
  const [selectedId, setSelectedId] = useState(
    templates.find(t => t.name === selectedTemplate)?.id || null
  );

  const handleApply = () => {
    if (selectedId) {
      onApplyTemplate(selectedId);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Choose a Template
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Select a template to start with a pre-built layout
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {templates.length === 0 ? (
                    <div className="text-center py-12">
                      <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        No templates available
                      </h3>
                      <p className="text-sm text-gray-500">
                        Start from scratch or check back later
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template) => {
                        const isSelected = selectedId === template.id;
                        return (
                          <button
                            key={template.id}
                            onClick={() => setSelectedId(template.id)}
                            className={`relative group text-left p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                            }`}
                          >
                            {template.preview_image && (
                              <div className="aspect-video rounded-lg mb-3 overflow-hidden bg-gray-100">
                                <img 
                                  src={template.preview_image} 
                                  alt={template.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {template.name}
                                </h3>
                                {template.description && (
                                  <p className="text-xs text-gray-500 line-clamp-2">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>

                            {template.is_default && (
                              <div className="absolute top-2 right-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Default
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!selectedId}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Template
                  </button>
                </div>

                {currentSectionsCount > 0 && (
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <span className="font-medium">Note:</span> Applying a new template will replace your current layout which has {currentSectionsCount} section{currentSectionsCount !== 1 ? 's' : ''}.
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}