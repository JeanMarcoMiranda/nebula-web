import { create } from "zustand";
import { nanoid } from "nanoid";
import { ColorNode, PaletteState } from "@/types/palette";
import { generateRandomHex, isValidHex } from "@/lib/colors";

export const usePaletteStore = create<PaletteState>((set) => ({
  colors: Array.from({ length: 5 }).map(() => ({
    id: nanoid(),
    hex: generateRandomHex(),
    isLocked: false,
  })),

  generatePalette: () =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.isLocked ? color : { ...color, hex: generateRandomHex() },
      ),
    })),

  toggleLock: (id) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id ? { ...color, isLocked: !color.isLocked } : color,
      ),
    })),

  updateColor: (id, newHex) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id && isValidHex(newHex)
          ? { ...color, hex: newHex }
          : color,
      ),
    })),

  setColors: (newColors) => set({ colors: newColors }),
}));
