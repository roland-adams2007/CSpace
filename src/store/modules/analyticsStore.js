import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useAnalyticsStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  range: "30d",

  setRange: (range) => set({ range }),

  fetchOverview: async (websiteId, range) => {
    if (!websiteId) return;
    const activeRange = range || get().range;
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/analytics/${websiteId}/overview?range=${activeRange}`);
      set({ data: res.data?.data ?? null, loading: false });
      return res.data?.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || "Failed to load analytics", loading: false });
      throw err;
    }
  },

  trackPageView:      async (payload) => { try { await axiosInstance.post("/analytics/track/pageview",     payload); } catch {} },
  trackEvent:         async (payload) => { try { await axiosInstance.post("/analytics/track/event",        payload); } catch {} },
  trackPerformance:   async (payload) => { try { await axiosInstance.post("/analytics/track/performance",  payload); } catch {} },
  trackFormAnalytics: async (payload) => { try { await axiosInstance.post("/analytics/track/form",         payload); } catch {} },
  trackSessionExit:   async (payload) => { try { await axiosInstance.post("/analytics/track/session-exit", payload); } catch {} },

  clearError: () => set({ error: null }),
  reset: () => set({ data: null, loading: false, error: null, range: "30d" }),
}));