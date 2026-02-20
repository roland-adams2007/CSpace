import { useThemeStore } from "../store/store";
import SectionLibrary from "../components/ui/theme/SectionLibrary";
import Canvas from "../components/ui/theme/Canvas";
import PropertiesPanel from "../components/ui/theme/PropertiesPanel";
import EditorHeader from "../components/ui/theme/EditorHeader";
import TemplateModal from "../components/ui/modals/theme/TemplateModal";
import SettingsModal from "../components/ui/modals/theme/SettingsModal";
import SkeletonLoader from "../components/ui/theme/SkeletonLoader";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThemeEditor() {
  const { useThemeEditor } = useThemeStore();
  const { websiteSlug, themeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const [oldSlug, setOldSlug] = useState("");

  const {
    theme,
    config,
    saving,
    loading,
    isLoading,
    isDirty,
    selectedTemplate,
    showSettings,
    showTemplateModal,
    canUndo,
    canRedo,
    setShowSettings,
    setShowTemplateModal,
    handleSave,
    handleAddSection,
    handlePreview,
    handleClose,
    applyTemplate,
    handleThemeChange,
    undo,
    redo,
  } = useThemeEditor();

  if (isLoading || loading || !theme) {
    return <SkeletonLoader />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EditorHeader
        theme={theme}
        isDirty={isDirty}
        saving={saving}
        canUndo={canUndo}
        canRedo={canRedo}
        onClose={handleClose}
        onUndo={undo}
        onRedo={redo}
        onPreview={handlePreview}
        onSave={handleSave}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SectionLibrary onAddSection={handleAddSection} />
        </div>

        <div className="flex-1 overflow-hidden">
          <Canvas selectedTemplate={selectedTemplate} />
        </div>

        <div className="w-80 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onApplyTemplate={applyTemplate}
        selectedTemplate={selectedTemplate}
        currentSectionsCount={config.layout?.sections?.length}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        config={config}
        onSave={handleSave}
        originalSlug={theme?.slug}
      />
    </div>
  );
}
