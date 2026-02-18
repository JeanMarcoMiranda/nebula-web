import { colord } from "colord";

export type ColorStrategy =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "tetradic";

// All possible role names in order of priority
export const COLOR_ROLES = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "ring",
  "tertiary",
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];

export interface UIColorScheme {
  name: string;
  description: string;
  colors: Record<ColorRole, { light: string; dark: string }>;
}

/**
 * Genera un color base optimizado para UI
 * - Saturación: 60-85% (evita grises y neones)
 * - Luminosidad: 45-65% (rango medio versátil)
 */
function generateUIFriendlyBase(): string {
  const h = Math.random() * 360;
  const s = 60 + Math.random() * 25; // 60-85%
  const l = 45 + Math.random() * 20; // 45-65%

  return colord({ h, s, l }).toHex();
}

/**
 * Genera paleta monocromática
 * Variaciones de un solo matiz con diferentes saturaciones y luminosidades
 */
function generateMonochromatic(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();

  return [
    colord({ h: hsl.h, s: hsl.s, l: 50 }).toHex(), // primary
    colord({ h: hsl.h, s: hsl.s * 0.6, l: 60 }).toHex(), // secondary
    colord({ h: hsl.h, s: Math.min(100, hsl.s * 1.1), l: 55 }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    colord({ h: hsl.h, s: hsl.s, l: 50 }).toHex(), // ring
    colord({ h: hsl.h, s: hsl.s * 0.8, l: 45 }).toHex(), // tertiary
  ];
}

/**
 * Genera paleta análoga (±30° en rueda de color)
 * Colores adyacentes que crean armonía natural
 */
function generateAnalogous(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();

  return [
    baseColor, // primary
    colord({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }).toHex(), // secondary
    colord({
      h: (hsl.h - 30 + 360) % 360,
      s: Math.min(100, hsl.s * 1.1),
      l: hsl.l,
    }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({ h: (hsl.h + 15) % 360, s: hsl.s * 0.9, l: hsl.l * 0.9 }).toHex(), // tertiary
  ];
}

/**
 * Genera paleta complementaria
 * Color base + su opuesto en la rueda (180°)
 */
function generateComplementary(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const complementHue = (hsl.h + 180) % 360;

  return [
    baseColor, // primary
    colord({ h: hsl.h, s: hsl.s * 0.6, l: 60 }).toHex(), // secondary
    colord({ h: complementHue, s: hsl.s, l: hsl.l }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({ h: complementHue, s: hsl.s * 0.7, l: 60 }).toHex(), // tertiary
  ];
}

/**
 * Genera paleta triádica (120° de separación)
 * Tres colores equidistantes en la rueda
 */
function generateTriadic(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();

  return [
    baseColor, // primary
    colord({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }).toHex(), // secondary
    colord({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({ h: (hsl.h + 60) % 360, s: hsl.s * 0.8, l: hsl.l }).toHex(), // tertiary
  ];
}

/**
 * Genera paleta complementaria dividida
 * Color base + dos adyacentes a su complementario
 */
function generateSplitComplementary(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const complementHue = (hsl.h + 180) % 360;

  return [
    baseColor, // primary
    colord({ h: (complementHue + 30) % 360, s: hsl.s, l: hsl.l }).toHex(), // secondary
    colord({ h: (complementHue - 30 + 360) % 360, s: hsl.s, l: hsl.l }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({ h: complementHue, s: hsl.s * 0.6, l: 60 }).toHex(), // tertiary
  ];
}

/**
 * Genera paleta tetrádica (rectángulo en rueda de color)
 * Cuatro colores en dos pares complementarios
 */
function generateTetradic(baseColor: string): string[] {
  const base = colord(baseColor);
  const hsl = base.toHsl();

  return [
    baseColor, // primary
    colord({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }).toHex(), // secondary
    colord({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }).toHex(), // accent
    colord({ h: hsl.h, s: hsl.s * 0.3, l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }).toHex(), // tertiary
  ];
}

/**
 * Genera variante dark mode optimizada
 * - Reduce saturación para menos fatiga visual
 * - Ajusta luminosidad considerando percepción en fondos oscuros
 */
function generateDarkVariant(lightColor: string): string {
  const light = colord(lightColor);
  const hsl = light.toHsl();

  let newL: number;
  if (hsl.l > 50) {
    newL = 30 + (100 - hsl.l) * 0.4; // 30-50 range
  } else {
    newL = 60 + hsl.l * 0.3; // 60-75 range
  }

  const newS = hsl.s * 0.8; // 80% de saturación original

  return colord({ h: hsl.h, s: newS, l: newL }).toHex();
}

/**
 * Genera paleta UI completa con estrategia especificada.
 * Siempre genera los 6 roles posibles; el store decide cuántos usar.
 */
export function generateUIPalette(
  strategy: ColorStrategy = "analogous",
  baseColor?: string,
): UIColorScheme {
  const base = baseColor || generateUIFriendlyBase();

  let colors: string[];
  let name: string;
  let description: string;

  switch (strategy) {
    case "monochromatic":
      colors = generateMonochromatic(base);
      name = "Monochromatic Harmony";
      description = "Cohesive palette with variations of a single hue";
      break;
    case "analogous":
      colors = generateAnalogous(base);
      name = "Analogous Harmony";
      description = "Naturally harmonious adjacent colors";
      break;
    case "complementary":
      colors = generateComplementary(base);
      name = "Complementary Contrast";
      description = "High contrast with opposite colors";
      break;
    case "triadic":
      colors = generateTriadic(base);
      name = "Triadic Balance";
      description = "Balanced palette with equidistant colors";
      break;
    case "split-complementary":
      colors = generateSplitComplementary(base);
      name = "Split Complementary";
      description = "Softer contrast than complementary";
      break;
    case "tetradic":
      colors = generateTetradic(base);
      name = "Tetradic Richness";
      description = "Rich palette with four harmonious colors";
      break;
    default:
      colors = generateAnalogous(base);
      name = "Analogous Harmony";
      description = "Naturally harmonious adjacent colors";
  }

  // Always build all 6 roles — the store slices to paletteSize
  return {
    name,
    description,
    colors: {
      primary: { light: colors[0], dark: generateDarkVariant(colors[0]) },
      secondary: { light: colors[1], dark: generateDarkVariant(colors[1]) },
      accent: { light: colors[2], dark: generateDarkVariant(colors[2]) },
      muted: { light: colors[3], dark: generateDarkVariant(colors[3]) },
      ring: { light: colors[4], dark: generateDarkVariant(colors[4]) },
      tertiary: { light: colors[5], dark: generateDarkVariant(colors[5]) },
    },
  };
}
