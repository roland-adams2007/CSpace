import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useWebsiteStore = create((set, get) => ({
  selectedWebsite: null,
  websites: [],
  loading: false,
  error: null,
  initialized: false,

  initialize: () => {
    try {
      const stored = localStorage.getItem("selectedWebsite");
      if (stored) {
        const parsedWebsite = JSON.parse(stored);
        set({ selectedWebsite: parsedWebsite, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error("Failed to parse stored website:", error);
      localStorage.removeItem("selectedWebsite");
      set({ selectedWebsite: null, initialized: true });
    }
  },

  fetchWebsites: async (forceRefresh = false) => {
    const { websites, initialized } = get();

    if (!forceRefresh && websites.length > 0 && initialized) {
      return websites;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/company-check");

      if (!response.data?.data?.websites) {
        throw new Error("Invalid response structure");
      }

      const websites = response.data.data.websites;
      set({ websites, loading: false, error: null });

      const { selectedWebsite } = get();
      if (!selectedWebsite && websites.length > 0) {
        get().setSelectedWebsite(websites[0]);
      }

      return websites;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load websites";

      set({
        error: errorMessage,
        loading: false,
      });

      console.error("Fetch websites error:", error);
      throw error;
    }
  },

  updateWebsite: async (data) => {
    if (!data?.id) {
      throw new Error("Website ID is required for update");
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/websites/update/" + data.id,
        data,
      );

      if (!response.data?.data) {
        throw new Error("Invalid response structure");
      }

      const updatedWebsite = response.data.data;

      set((state) => ({
        websites: state.websites.map((website) =>
          website.id === updatedWebsite.id ? updatedWebsite : website,
        ),
        loading: false,
        error: null,
      }));
      const { selectedWebsite } = get();
      if (selectedWebsite?.id === updatedWebsite.id) {
        get().setSelectedWebsite(updatedWebsite);
      }

      return updatedWebsite;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update website";

      set({
        error: errorMessage,
        loading: false,
      });

      console.error("Update website error:", error);
      throw error;
    }
  },

  setSelectedWebsite: (website) => {
    if (website) {
      try {
        localStorage.setItem("selectedWebsite", JSON.stringify(website));
      } catch (error) {
        console.error("Failed to store selected website:", error);
      }
    } else {
      localStorage.removeItem("selectedWebsite");
    }

    set({ selectedWebsite: website });
  },

  clearSelectedWebsite: () => {
    localStorage.removeItem("selectedWebsite");
    set({ selectedWebsite: null });
  },

  addWebsite: (website) => {
    if (!website) return;

    set((state) => ({
      websites: [website, ...state.websites],
    }));
  },

  removeWebsite: (websiteId) => {
    if (!websiteId) return;

    set((state) => {
      const newWebsites = state.websites.filter((w) => w.id !== websiteId);

      // Clear selected website if it was removed
      if (state.selectedWebsite?.id === websiteId) {
        localStorage.removeItem("selectedWebsite");
        return {
          websites: newWebsites,
          selectedWebsite: newWebsites.length > 0 ? newWebsites[0] : null,
        };
      }

      return { websites: newWebsites };
    });
  },

  getWebsiteById: (websiteId) => {
    if (!websiteId) return null;
    const { websites } = get();
    return websites.find((w) => w.id === websiteId) || null;
  },

  clearError: () => set({ error: null }),

  reset: () => {
    localStorage.removeItem("selectedWebsite");
    set({
      selectedWebsite: null,
      websites: [],
      loading: false,
      error: null,
      initialized: false,
    });
  },
}));
