import { create } from "zustand";

export const useWebsiteStore = create((set, get) => ({
  selectedWebsite: null,

  initialize: () => {
    const stored = localStorage.getItem("selectedWebsite");
    if (stored) {
      set({ selectedWebsite: JSON.parse(stored) });
    }
  },

  setSelectedWebsite: (website) => {
    if (website) {
      localStorage.setItem("selectedWebsite", JSON.stringify(website));
    }
    set({ selectedWebsite: website });
  },

  clearSelectedWebsite: () => {
    localStorage.removeItem("selectedWebsite");
    set({ selectedWebsite: null });
  },
}));
