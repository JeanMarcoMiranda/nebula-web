import { create } from "zustand";
import { nanoid } from "nanoid";
import { ColorNode, PaletteState } from "@/types/palette";
import {
  generateRandomHex,
  isValidHex,
  generateThemeVariant,
} from "@/lib/colors";

export const usePaletteStore = create<PaletteState>((set) => ({
  paletteSize: 5,
  colors: Array.from({ length: 5 }).map(() => {
    const baseColor = generateRandomHex();
    return {
      id: nanoid(),
      lightHex: baseColor,
      darkHex: generateThemeVariant(baseColor),
      isLocked: false,
    };
  }),

  generatePalette: () =>
    set((state) => ({
      colors: state.colors.map((color) => {
        if (color.isLocked) return color;
        const newBase = generateRandomHex();
        return {
          ...color,
          lightHex: newBase,
          darkHex: generateThemeVariant(newBase),
        };
      }),
    })),

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
      if (size > state.paletteSize) {
        const newColors = Array.from({ length: size - state.paletteSize }).map(
          () => {
            const baseColor = generateRandomHex();
            return {
              id: nanoid(),
              lightHex: baseColor,
              darkHex: generateThemeVariant(baseColor),
              isLocked: false,
            };
          },
        );
        return { paletteSize: size, colors: [...state.colors, ...newColors] };
      } else {
        return { paletteSize: size, colors: state.colors.slice(0, size) };
      }
    }),
}));
