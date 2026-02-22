import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store";
import { createNewSection } from "../../utils/sectionLibrary";

export const useThemeStore = create((set, get) => ({
  themes: [],
  currentTheme: null,
  templates: [],
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

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/themes/templates");
      const templates = response.data.data.templates || [];
      set({ templates, loading: false });
      return templates;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load templates",
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

  getTheme: async (themeSlug) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/themes/${themeSlug}`);
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
    const { getTheme, updateTheme, loading, fetchTemplates, templates } = get();
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
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [originalSlug, setOriginalSlug] = useState(themeSlug);

    useEffect(() => {
      loadTemplates();
    }, []);

    useEffect(() => {
      loadTheme();
    }, [themeSlug]);

    const loadTemplates = async () => {
      try {
        await fetchTemplates();
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    };

    const loadTheme = async () => {
      try {
        const themeData = await getTheme(themeSlug);
        setTheme(themeData);
        setOriginalSlug(themeData.slug);

        let configData = themeData.config_json;
        if (typeof configData === "string") {
          configData = JSON.parse(configData);
        }

        setConfig(configData);

        if (configData.template_id) {
          const template = templates.find(
            (t) => t.id === configData.template_id,
          );
          if (template) {
            setSelectedTemplate(template.name);
          }
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
        const template = templates.find((t) => t.name === selectedTemplate);
        const updatedConfig = {
          ...config,
          template_id: template?.id || null,
          template_name: selectedTemplate,
        };

        const response = await updateTheme(theme.id, {
          config_json: JSON.stringify(updatedConfig),
          name: theme.name,
        });

        setConfig(updatedConfig);
        resetDirty();

        return response;
      } catch (error) {
        console.error("Failed to save theme:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    };

    const handleAddSection = (libraryItem) => {
      const newSection = createNewSection(libraryItem);
      addSection(newSection);
    };

    const handlePreview = () => {
      const template = templates.find((t) => t.name === selectedTemplate);
      const currentConfig = {
        ...config,
        template_id: template?.id || null,
        template_name: selectedTemplate,
        previewMode: true,
      };

      useEditorStore.getState().setConfig(currentConfig);

      if (isDirty) {
        if (confirm("You have unsaved changes. Save before previewing?")) {
          handleSave().then(() => {
            window.open(
              `${import.meta.env.VITE_APP_URL}/t/${theme.slug}?preview=true`,
              "_blank",
            );
          });
        } else {
          window.open(
            `${import.meta.env.VITE_APP_URL}/t/${theme.slug}?preview=true`,
            "_blank",
          );
        }
      } else {
        window.open(
          `${import.meta.env.VITE_APP_URL}/t/${theme.slug}?preview=true`,
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

    const applyTemplate = (templateId) => {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        console.error("Template not found:", templateId);
        return;
      }

      if (config.layout.sections.length > 0) {
        if (
          !confirm(
            "Applying a new template will replace your current layout. Continue?",
          )
        ) {
          return;
        }
      }

      setSelectedTemplate(template.name);
      setShowTemplateModal(false);

      // Parse the base_config_json if it's a string
      const baseConfig =
        typeof template.base_config_json === "string"
          ? JSON.parse(template.base_config_json)
          : template.base_config_json;

      // Create new config with template structure
      const newConfig = {
        ...config,
        template_id: template.id,
        template_name: template.name,
        header: baseConfig.header || config.header,
        footer: baseConfig.footer || config.footer,
        layout: {
          sections: baseConfig.layout?.sections || [],
        },
        theme: baseConfig.theme || config.theme,
      };

      // Update the editor store
      useEditorStore.getState().setConfig(newConfig);
      useEditorStore.getState().resetDirty();

      // Also update the local state if needed
      setConfig(newConfig);
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
      originalSlug,
      templates,
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
