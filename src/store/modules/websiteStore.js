import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useWebsiteStore = create((set, get) => ({
  selectedWebsite: null,
  websites: [],
  loading: false,
  error: null,

  initialize: () => {
    const stored = localStorage.getItem("selectedWebsite");
    if (stored) {
      set({ selectedWebsite: JSON.parse(stored) });
    }
  },

  fetchWebsites: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/company-check");
      const websites = response.data.data.websites || [];
      set({ websites, loading: false });
      return websites;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load websites",
        loading: false,
      });
      throw error;
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

  addWebsite: (website) => {
    set((state) => ({
      websites: [website, ...state.websites],
    }));
  },
}));
