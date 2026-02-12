import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store";
import { createNewSection } from "../../utils/sectionLibrary";
import { TEMPLATE_STRUCTURES } from "../../constants/templateStructures";

export const useThemeStore = create((set, get) => ({
  themes: [],
  currentTheme: null,
  loading: false,
  error: null,

  fetchThemes: async (websiteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/themes?website_id=${websiteId}`,
      );
      const themes = response.data.data.themes || [];
      set({ themes, loading: false });
      return themes;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load themes",
        loading: false,
      });
      throw error;
    }
  },

  createTheme: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/themes/create", data);
      const newTheme = response.data.data.theme;
      set((state) => ({
        themes: [newTheme, ...state.themes],
        loading: false,
      }));
      return newTheme;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create theme",
        loading: false,
      });
      throw error;
    }
  },

  updateTheme: async (themeId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/themes/${themeId}`, data);
      const updatedTheme = response.data.data.theme;
      set((state) => ({
        themes: state.themes.map((t) => (t.id === themeId ? updatedTheme : t)),
        currentTheme:
          state.currentTheme?.id === themeId
            ? updatedTheme
            : state.currentTheme,
        loading: false,
      }));
      return updatedTheme;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update theme",
        loading: false,
      });
      throw error;
    }
  },

  deleteTheme: async (themeId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/themes/${themeId}`);
      set((state) => ({
        themes: state.themes.filter((t) => t.id !== themeId),
        currentTheme:
          state.currentTheme?.id === themeId ? null : state.currentTheme,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete theme",
        loading: false,
      });
      throw error;
    }
  },

  setActiveTheme: async (themeId, websiteId) => {
    try {
      await axiosInstance.post(`/themes/${themeId}/set-active`, {
        website_id: websiteId,
      });
      set((state) => ({
        themes: state.themes.map((t) => ({
          ...t,
          is_active: t.id === themeId ? 1 : 0,
        })),
      }));
    } catch (error) {
      throw error;
    }
  },

  getTheme: async (themeId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/themes/${themeId}`);
      const theme = response.data.data.theme;
      set({ currentTheme: theme, loading: false });
      return theme;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load theme",
        loading: false,
      });
      throw error;
    }
  },

  setCurrentTheme: (theme) => set({ currentTheme: theme }),

  useThemeEditor: () => {
    const { themeSlug } = useParams();
    const navigate = useNavigate();
    const { getTheme, updateTheme, loading } = get();
    const {
      config,
      setConfig,
      addSection,
      undo,
      redo,
      canUndo,
      canRedo,
      isDirty,
      resetDirty,
    } = useEditorStore();

    const [theme, setTheme] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadTheme();
    }, [themeSlug]);

    const loadTheme = async () => {
      try {
        const themeData = await getTheme(themeSlug);
        setTheme(themeData);

        let configData = themeData.config_json;
        if (typeof configData === "string") {
          configData = JSON.parse(configData);
        }

        setConfig(configData);

        if (configData.template) {
          setSelectedTemplate(configData.template);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        navigate("/website-builder");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSave = async () => {
      setSaving(true);
      try {
        const updatedConfig = {
          ...config,
          template: selectedTemplate,
        };

        await updateTheme(theme.id, {
          config_json: JSON.stringify(updatedConfig),
          name: theme.name,
        });
        setConfig(updatedConfig);
        resetDirty();
      } catch (error) {
        console.error("Failed to save theme:", error);
      } finally {
        setSaving(false);
      }
    };

    const handleAddSection = (libraryItem) => {
      const newSection = createNewSection(libraryItem);
      addSection(newSection);
    };

    const handlePreview = () => {
      const currentConfig = {
        ...config,
        template: selectedTemplate,
        previewMode: true,
      };

      useEditorStore.getState().setConfig(currentConfig);

      if (isDirty) {
        if (confirm("You have unsaved changes. Save before previewing?")) {
          handleSave().then(() => {
            window.open(
              `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
              "_blank",
            );
          });
        } else {
          window.open(
            `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
            "_blank",
          );
        }
      } else {
        window.open(
          `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
          "_blank",
        );
      }
    };

    const handleClose = () => {
      if (isDirty) {
        if (
          confirm("You have unsaved changes. Are you sure you want to leave?")
        ) {
          navigate("/website-builder");
        }
      } else {
        navigate("/website-builder");
      }
    };

    const applyTemplate = (templateName) => {
      if (config.layout.sections.length > 0) {
        if (
          !confirm(
            "Applying a new template will replace your current layout. Continue?",
          )
        ) {
          return;
        }
      }

      setSelectedTemplate(templateName);
      setShowTemplateModal(false);

      const template = TEMPLATE_STRUCTURES[templateName];
      const newSections = template.structure.map((section) => ({
        ...section,
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      const newConfig = {
        ...config,
        template: templateName,
        layout: {
          ...config.layout,
          sections: newSections,
        },
      };

      useEditorStore.getState().setConfig(newConfig);
      useEditorStore.getState().resetDirty();
    };

    const handleThemeChange = (updatedTheme) => {
      setTheme(updatedTheme);
    };

    return {
      theme,
      config,
      saving,
      loading,
      isLoading,
      isDirty,
      selectedTemplate,
      showSettings,
      showTemplateModal,
      canUndo: canUndo(),
      canRedo: canRedo(),
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
    };
  },
}));
