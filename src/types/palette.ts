export interface ColorNode {
  id: string;
  hex: string;
  isLocked: boolean;
}

export interface PaletteState {
  colors: ColorNode[];
  generatePalette: () => void;
  toggleLock: (id: string) => void;
  updateColor: (id: string, newHex: string) => void;
  setColors: (colors: ColorNode[]) => void;
}