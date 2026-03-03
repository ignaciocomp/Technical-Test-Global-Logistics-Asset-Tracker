import { create } from 'zustand';
import { login as loginApi } from '../api/authApi';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  login: async (username, password) => {
    const token = await loginApi(username, password);
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));
