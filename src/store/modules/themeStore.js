import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useThemeStore = create((set, get) => ({
  themes: [],
  currentTheme: null,
  loading: false,
  error: null,

  fetchThemes: async (websiteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/themes?website_id=${websiteId}`);
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
        themes: state.themes.map((t) =>
          t.id === themeId ? updatedTheme : t
        ),
        currentTheme: state.currentTheme?.id === themeId ? updatedTheme : state.currentTheme,
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
        currentTheme: state.currentTheme?.id === themeId ? null : state.currentTheme,
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
      await axiosInstance.post(`/themes/${themeId}/set-active`, { website_id: websiteId });
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
}));