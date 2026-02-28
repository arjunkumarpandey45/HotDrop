import { create } from 'zustand';
import api from '../api/Api.js';

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isCheckingAuth: true,


  login: async (identifier, password) => {
    try {
      const payload = identifier.includes('@') 
        ? { email: identifier, password } 
        : { hotdropId: identifier, password };

      const res = await api.post('/auth/login', payload);
      
    
      set({ 
        user: { 
          userId: res.data.data.userId, 
          hotdropId: res.data.data.hotdropId,
          username: res.data.data.username 
        }, 
        isLoggedIn: true 
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },


  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get('/user/me'); 
      set({ user: res.data.data.user, isLoggedIn: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isLoggedIn: false, isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isLoggedIn: false });
    } catch (error) {
      console.error("Logout error", error);
    }
  }
}));