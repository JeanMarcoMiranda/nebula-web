import { ColorStrategy } from "@/lib/paletteGenerator";

export interface ColorNode {
  id: string;
  lightHex: string;
  darkHex: string;
  isLocked: boolean;
  role?: "primary" | "secondary" | "accent" | "muted" | "ring" | "tertiary";
}

export interface PaletteState {
  colors: ColorNode[];
  schemeName: string;
  schemeDescription: string;
  schemeMood: string;
  schemeUseCases: string[];
  schemeTags: string[];
  generatePalette: () => void;
  toggleLock: (id: string) => void;
  updateColor: (id: string, newHex: string, mode: "light" | "dark") => void;
  setColors: (colors: ColorNode[]) => void;
  paletteSize: number;
  setPaletteSize: (size: number) => void;
  view: "generator" | "preview";
  setView: (view: "generator" | "preview") => void;
  strategy: ColorStrategy;
  setStrategy: (strategy: ColorStrategy) => void;
}
