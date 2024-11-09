import { create } from "zustand";

export const useStateStore = create((set) => ({
  // State
  useMainnet: false,
  
  // Actions
  setUseMainnet: (value) => set(() => ({ useMainnet: value })),

}));