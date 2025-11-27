import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);
