import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const usePagesStore = create((set, get) => ({
  pages: [],
  loadedWebsiteId: null,

  fetchPages: async (websiteId) => {
    if (get().loadedWebsiteId === websiteId) return;
    try {
      const res = await axiosInstance.get(`/pages?website_id=${websiteId}`);
      set({ pages: res.data.data.pages || [], loadedWebsiteId: websiteId });
    } catch (e) {
      console.error("Failed to fetch pages", e);
    }
  },
}));