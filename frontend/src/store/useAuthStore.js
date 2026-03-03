import { create } from 'zustand';
import api from '../api/Api.js';
export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isCheckingAuth: false,
updatePostCountLocally: () => {
    set((state) => ({
      user: state.user 
        ? { ...state.user, postCount: (state.user.postCount || 0) + 1 } 
        : null
    }));
  },
  login: async (identifier, password) => {
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { hotdropId: identifier, password };

      const res = await api.post("/auth/login", payload);

      set({
        user: res.data.data,
        isLoggedIn: true,
        isCheckingAuth: false,
      });
console.log(res.data.data)
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/user/me");
      set({
        user: res.data.data.user,
        isLoggedIn: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        user: null,
        isLoggedIn: false,
        isCheckingAuth: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isLoggedIn: false });
    }
  },
}));