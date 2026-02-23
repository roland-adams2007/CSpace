import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useAssetStore = create((set, get) => ({
  assets: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },

  fetchAssets: async (websiteId, page = 1, limit = 12) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get(`/assets`, {
        params: {
          website_id: websiteId,
          page,
          per_page: limit,
        },
      });

      const { assets, meta } = response.data.data;

      set({
        assets: assets || [],
        pagination: {
          currentPage: meta?.current_page || page,
          lastPage: meta?.last_page || 1,
          total: meta?.total || 0,
          perPage: meta?.per_page || limit,
        },
        loading: false,
      });

      return assets;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load assets",
        loading: false,
      });
      throw error;
    }
  },

  uploadAsset: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/assets/upload", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const newAsset = response.data.data.asset;
      set((state) => ({
        assets: [newAsset, ...state.assets],
        loading: false,
      }));
      return newAsset;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload asset",
        loading: false,
      });
      throw error;
    }
  },

  deleteAsset: async (assetId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/assets/${assetId}`);
      set((state) => ({
        assets: state.assets.filter((asset) => asset.id !== assetId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete asset",
        loading: false,
      });
      throw error;
    }
  },

  clearAssets: () => {
    set({
      assets: [],
      error: null,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
      },
    });
  },

  get totalPages() {
    return get().pagination.lastPage;
  },

  get totalItems() {
    return get().pagination.total;
  },
}));
