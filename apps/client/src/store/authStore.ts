import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setTokens: ({ accessToken, refreshToken, user }) =>
    set({ accessToken, refreshToken, user }),
  clear: () => set({ accessToken: null, refreshToken: null, user: null }),
}));

export const getAuthStore = () => useAuthStore.getState();
