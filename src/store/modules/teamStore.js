import { create } from "zustand";
import axiosInstance from "./../../api/axiosInstance";

export const useTeamStore = create((set, get) => ({
  members: [],
  pendingInvitations: [],
  currentInvitation: null,
  loading: false,
  error: null,

  getTeamMembers: async (websiteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/team/${websiteId}`);
      const members = response.data.data.members || [];
      set({ members, loading: false });
      return members;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load team members",
        loading: false,
      });
      throw error;
    }
  },

  getPendingInvitations: async (websiteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/team/${websiteId}/invitations`,
      );
      const invitations = response.data.data.invitations || [];
      set({ pendingInvitations: invitations, loading: false });
      return invitations;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load invitations",
        loading: false,
      });
      throw error;
    }
  },

  sendTeamInvite: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/team/invite/send", payload);
      const invitation = response.data.data.invitation;
      set((state) => ({
        pendingInvitations: [invitation, ...state.pendingInvitations],
        loading: false,
      }));
      return invitation;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to send invite",
        loading: false,
      });
      throw error;
    }
  },

  acceptTeamInvite: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/team/invite/accept", payload);
      const member = response.data.data.member;
      set((state) => ({
        members: [member, ...state.members],
        pendingInvitations: state.pendingInvitations.filter(
          (inv) => inv.id !== payload.invitationId,
        ),
        loading: false,
      }));
      return member;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to accept invite",
        loading: false,
      });
      throw error;
    }
  },

  declineInvitation: async (invitationId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/team/invite/decline", { invitationId });
      set((state) => ({
        pendingInvitations: state.pendingInvitations.filter(
          (inv) => inv.id !== invitationId,
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to decline invite",
        loading: false,
      });
      throw error;
    }
  },

  removeMember: async (memberId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/team/${memberId}`);
      set((state) => ({
        members: state.members.filter((member) => member.id !== memberId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to remove member",
        loading: false,
      });
      throw error;
    }
  },

  // NEW: Update member role
  updateMemberRole: async (memberId, role) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/team/${memberId}/role`, {
        role,
      });
      const updatedMember = response.data.data.member;
      set((state) => ({
        members: state.members.map((member) =>
          member.id === memberId ? { ...member, role } : member,
        ),
        loading: false,
      }));
      return updatedMember;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update member role",
        loading: false,
      });
      throw error;
    }
  },

  fetchInvitationDetails: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/team/invite/${token}`);
      const invitation = response.data.data.invitation;
      set({ currentInvitation: invitation, loading: false });
      return invitation;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch invitation details",
        loading: false,
      });
      throw error;
    }
  },

  clearCurrentInvitation: () => {
    set({ currentInvitation: null });
  },

  clearTeam: () => {
    set({ members: [], pendingInvitations: [], error: null });
  },

  get memberCount() {
    return get().members.length;
  },

  get invitationCount() {
    return get().pendingInvitations.length;
  },
}));
