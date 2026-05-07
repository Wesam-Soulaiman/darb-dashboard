import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import type { FontKey } from "../theme/config/fonts";
import type { PaletteKey } from "../theme/config/palettes";

export type ThemeMode = "dark" | "light";

type ThemeState = {
  mode: ThemeMode;
  paletteKey: PaletteKey;
  fontKey: FontKey;
};

type ThemeActions = {
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setPalette: (paletteKey: PaletteKey) => void;
  setFont: (fontKey: FontKey) => void;
  resetTheme: () => void;
};

type ThemeStore = ThemeState & ThemeActions;

const THEME_STORAGE_KEY = "public_transportation_theme";

const defaultThemeState: ThemeState = {
  mode: "dark",
  paletteKey: "energetic",
  fontKey: "interCairo",
};

const storage: StateStorage | undefined =
  typeof window !== "undefined" ? localStorage : undefined;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...defaultThemeState,

      toggleMode: () => {
        set((state) => ({
          mode: state.mode === "dark" ? "light" : "dark",
        }));
      },

      setMode: (mode) => {
        set({ mode });
      },

      setPalette: (paletteKey) => {
        set({ paletteKey });
      },

      setFont: (fontKey) => {
        set({ fontKey });
      },

      resetTheme: () => {
        set(defaultThemeState);
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: storage ? createJSONStorage(() => storage) : undefined,
      partialize: (state) => ({
        mode: state.mode,
        paletteKey: state.paletteKey,
        fontKey: state.fontKey,
      }),
    },
  ),
);
