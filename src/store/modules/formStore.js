import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useFormStore = create((set, get) => ({
  forms: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },

  fetchForms: async (websiteId, page = 1, limit = 12) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get(`/forms`, {
        params: {
          website_id: websiteId,
          page,
          per_page: limit,
        },
      });

      const { forms, meta } = response.data.data;

      set({
        forms: forms || [],
        pagination: {
          currentPage: meta?.current_page || page,
          lastPage: meta?.last_page || 1,
          total: meta?.total || 0,
          perPage: meta?.per_page || limit,
        },
        loading: false,
      });

      return forms;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load forms",
        loading: false,
      });
      throw error;
    }
  },

  createForm: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/forms", payload);
      const newForm = response.data.data.form;
      set((state) => ({
        forms: [newForm, ...state.forms],
        loading: false,
      }));
      return newForm;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create form",
        loading: false,
      });
      throw error;
    }
  },

  updateForm: async (formId, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/forms/${formId}`, payload);
      const updatedForm = response.data.data.form;
      set((state) => ({
        forms: state.forms.map((form) =>
          form.id === formId ? updatedForm : form,
        ),
        loading: false,
      }));
      return updatedForm;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update form",
        loading: false,
      });
      throw error;
    }
  },

  deleteForm: async (formId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/forms/${formId}`);
      set((state) => ({
        forms: state.forms.filter((form) => form.id !== formId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete form",
        loading: false,
      });
      throw error;
    }
  },

  clearForms: () => {
    set({
      forms: [],
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
