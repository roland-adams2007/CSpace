import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  config: {
    header: {
      type: "default",
      props: {
        logo: "",
        menu: [],
        ctaButton: { text: "", link: "" },
      },
      style: {
        height: "80px",
        sticky: false,
        backgroundColor: "#ffffff",
      },
    },
    footer: {
      type: "default",
      props: {
        columns: [],
        copyright: "",
      },
      style: {
        backgroundColor: "#111827",
        textColor: "#ffffff",
        padding: "3rem 0",
      },
    },
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
  },
  
  selectedSection: null,
  selectedHeader: false,
  selectedFooter: false,
  selectedBlock: null,
  history: [],
  historyIndex: -1,
  isDirty: false,

  setConfig: (config) => {
    set({ config, isDirty: false });
    get().addToHistory(config);
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
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        sections,
      },
    };
    set({ config: newConfig, isDirty: true });
    get().addToHistory(newConfig);
  },

  selectSection: (sectionId) => {
    set({ selectedSection: sectionId, selectedHeader: false, selectedFooter: false, selectedBlock: null });
  },

  selectHeader: (value = true) => {
    set({ selectedHeader: value, selectedSection: null, selectedFooter: false, selectedBlock: null });
  },

  selectFooter: (value = true) => {
    set({ selectedFooter: value, selectedSection: null, selectedHeader: false, selectedBlock: null });
  },

  selectBlock: (sectionId, blockId) => {
    set({ selectedSection: sectionId, selectedBlock: blockId, selectedHeader: false, selectedFooter: false });
  },

  addToHistory: (config) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(config)));
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        config: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        config: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  resetDirty: () => {
    set({ isDirty: false });
  },
}));