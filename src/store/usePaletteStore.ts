import { create } from "zustand";
import { nanoid } from "nanoid";
import { ColorNode, PaletteState } from "@/types/palette";
import { isValidHex } from "@/lib/colors";
import {
  generateUIPalette,
  ColorStrategy,
  UIColorScheme,
} from "@/lib/paletteGenerator";

// Helper to convert UIColorScheme to ColorNode array
function schemeToColorNodes(scheme: UIColorScheme): ColorNode[] {
  const roles: Array<keyof UIColorScheme["colors"]> = [
    "primary",
    "secondary",
    "accent",
    "muted",
    "ring",
  ];

  return roles.map((role) => ({
    id: nanoid(),
    lightHex: scheme.colors[role].light,
    darkHex: scheme.colors[role].dark,
    isLocked: false,
    role,
  }));
}

// Generate initial palette
const initialScheme = generateUIPalette("analogous");
const initialColors = schemeToColorNodes(initialScheme);

export const usePaletteStore = create<PaletteState>((set) => ({
  paletteSize: 5,
  colors: initialColors,
  strategy: "analogous",

  setStrategy: (strategy: ColorStrategy) => set({ strategy }),

  generatePalette: () =>
    set((state) => {
      const scheme = generateUIPalette(state.strategy);
      const newColors = schemeToColorNodes(scheme);

      // Preserve locked colors
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
      if (size > state.paletteSize) {
        // Generate new scheme and take additional colors
        const scheme = generateUIPalette(state.strategy);
        const allColors = schemeToColorNodes(scheme);
        const additionalColors = allColors.slice(state.paletteSize, size);

        return {
          paletteSize: size,
          colors: [...state.colors, ...additionalColors],
        };
      } else {
        return { paletteSize: size, colors: state.colors.slice(0, size) };
      }
    }),

  view: "generator",
  setView: (view) => set({ view }),
}));
