import { create } from "zustand";
import { nanoid } from "nanoid";
import { ColorNode, PaletteState } from "@/types/palette";
import { isValidHex } from "@/lib/colors";
import {
  generateUIPalette,
  ColorStrategy,
  UIColorScheme,
  COLOR_ROLES,
} from "@/lib/paletteGenerator";

// Helper to convert UIColorScheme to ColorNode array, sliced to `size`
function schemeToColorNodes(scheme: UIColorScheme, size: number): ColorNode[] {
  return COLOR_ROLES.slice(0, size).map((role) => ({
    id: nanoid(),
    lightHex: scheme.colors[role].light,
    darkHex: scheme.colors[role].dark,
    isLocked: false,
    role,
  }));
}

// Generate initial palette
const INITIAL_SIZE = 5;
const initialScheme = generateUIPalette("analogous");
const initialColors = schemeToColorNodes(initialScheme, INITIAL_SIZE);

export const usePaletteStore = create<PaletteState>((set) => ({
  paletteSize: INITIAL_SIZE,
  colors: initialColors,
  strategy: "analogous",

  setStrategy: (strategy: ColorStrategy) => set({ strategy }),

  generatePalette: () =>
    set((state) => {
      const scheme = generateUIPalette(state.strategy);
      const newColors = schemeToColorNodes(scheme, state.paletteSize);

      // Preserve locked colors by position
      return {
        colors: state.colors.map((color, index) => {
          if (color.isLocked) return color;
          return newColors[index] || color;
        }),
      };
    }),

  toggleLock: (id) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id ? { ...color, isLocked: !color.isLocked } : color,
      ),
    })),

  updateColor: (id, newHex, mode) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id && isValidHex(newHex)
          ? { ...color, [mode === "light" ? "lightHex" : "darkHex"]: newHex }
          : color,
      ),
    })),

  setColors: (newColors) => set({ colors: newColors }),

  setPaletteSize: (size) =>
    set((state) => {
      if (size === state.paletteSize) return state;

      // Generate a fresh full scheme to pick colors from
      const scheme = generateUIPalette(state.strategy);
      const allNewColors = schemeToColorNodes(scheme, size);

      if (size > state.paletteSize) {
        // Keep existing colors (with locks), append new ones for extra slots
        const extended = allNewColors.map((newColor, index) => {
          const existing = state.colors[index];
          // Preserve existing color (locked or not) for slots that already existed
          return existing ?? newColor;
        });
        return { paletteSize: size, colors: extended };
      } else {
        // Shrink: just slice, preserving locks
        return { paletteSize: size, colors: state.colors.slice(0, size) };
      }
    }),

  view: "generator",
  setView: (view) => set({ view }),
}));
