import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  config: {
    template_name: null,
    previewMode: false,
    layout: {
      sections: [],
    },
    theme: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        background: "#ffffff",
        text: "#111827",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
    },
    siteSettings: {
      loader: {
        enabled: false,
        type: "spinner",
        spinnerColor: "#6366f1",
        backgroundColor: "#ffffff",
        image: "",
        svg: "",
        duration: 2000,
      },
      envVars: [],
    },
  },

  selectedSection: null,
  history: [],
  historyIndex: -1,
  isDirty: false,

  setConfig: (config) => {
    const normalized = {
      ...config,
      siteSettings: config.siteSettings || {
        loader: { enabled: false, type: "spinner", spinnerColor: "#6366f1", backgroundColor: "#ffffff", image: "", svg: "", duration: 2000 },
        envVars: [],
      },
    };
    set({ config: normalized, isDirty: false });
    get().addToHistory(normalized);
  },

  updateConfig: (path, value) => {
    const newConfig = { ...get().config };
    const keys = path.split(".");
    let current = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    set({ config: newConfig, isDirty: true });
    get().addToHistory(newConfig);
  },

  addSection: (section) => {
    const config = get().config;
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        sections: [...config.layout.sections, section],
      },
    };
    set({ config: newConfig, isDirty: true });
    get().addToHistory(newConfig);
  },

  updateSection: (sectionId, updates) => {
    const config = get().config;
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        sections: config.layout.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
      },
    };
    set({ config: newConfig, isDirty: true });
    get().addToHistory(newConfig);
  },

  deleteSection: (sectionId) => {
    const config = get().config;
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        sections: config.layout.sections.filter((section) => section.id !== sectionId),
      },
    };
    set({ config: newConfig, isDirty: true, selectedSection: null });
    get().addToHistory(newConfig);
  },

  reorderSections: (sections) => {
    const config = get().config;
    const newConfig = { ...config, layout: { ...config.layout, sections } };
    set({ config: newConfig, isDirty: true });
    get().addToHistory(newConfig);
  },

  selectSection: (sectionId) => {
    set({ selectedSection: sectionId });
  },

  setTemplate: (templateName) => {
    set((state) => ({ config: { ...state.config, template_name: templateName }, isDirty: true }));
    get().addToHistory({ ...get().config, template_name: templateName });
  },

  addToHistory: (config) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(config)));
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ config: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex, isDirty: true });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ config: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex, isDirty: true });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  resetDirty: () => set({ isDirty: false }),
}));