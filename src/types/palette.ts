export interface ColorNode {
  id: string;
  lightHex: string;
  darkHex: string;
  isLocked: boolean;
}

export interface PaletteState {
  colors: ColorNode[];
  generatePalette: () => void;
  toggleLock: (id: string) => void;
  updateColor: (id: string, newHex: string, mode: "light" | "dark") => void;
  setColors: (colors: ColorNode[]) => void;
}
