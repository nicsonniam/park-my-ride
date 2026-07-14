import { create } from "zustand";

type UIStore = {
  toggleSearch: boolean;
  setToggleSearch: (value: boolean) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  toggleSearch: false,

  setToggleSearch: (value) =>
    set({
      toggleSearch: value,
    }),
}));
