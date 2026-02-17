import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import harmoniesPlugin from "colord/plugins/harmonies";

// Extender colord con los plugins necesarios
extend([a11yPlugin, harmoniesPlugin]);

/**
 * Genera un color hexadecimal aleatorio
 */
export const generateRandomHex = (): string => {
  return colord({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }).toHex();
};

/**
 * Retorna el color de contraste apropiado (blanco o negro)
 * basado en la luminosidad del color de fondo
 */
export const getContrastColor = (color: string): string => {
  return colord(color).isDark() ? "#ffffff" : "#000000";
};

/**
 * Valida si un string es un color hexadecimal válido
 */
export const isValidHex = (color: string): boolean => {
  return colord(color).isValid();
};

/**
 * Genera armonías de color usando el plugin harmonies de colord
 * Retorna arrays de colores hexadecimales para cada tipo de armonía
 */
export const getHarmonies = (color: string) => {
  const c = colord(color);

  return {
    complementary: c.harmonies("complementary").map((color) => color.toHex()),
    analogous: c.harmonies("analogous").map((color) => color.toHex()),
    triadic: c.harmonies("triadic").map((color) => color.toHex()),
    splitComplementary: c
      .harmonies("split-complementary")
      .map((color) => color.toHex()),
    tetradic: c.harmonies("tetradic").map((color) => color.toHex()),
    rectangle: c.harmonies("rectangle").map((color) => color.toHex()),
    doubleSplitComplementary: c
      .harmonies("double-split-complementary")
      .map((color) => color.toHex()),
  };
};

/**
 * Funciones adicionales útiles para un generador de paletas
 */

/**
 * Oscurece un color por un factor (0-1)
 */
export const darkenColor = (color: string, amount: number = 0.1): string => {
  return colord(color).darken(amount).toHex();
};

/**
 * Aclara un color por un factor (0-1)
 */
export const lightenColor = (color: string, amount: number = 0.1): string => {
  return colord(color).lighten(amount).toHex();
};

/**
 * Desatura un color por un factor (0-1)
 */
export const desaturateColor = (
  color: string,
  amount: number = 0.1,
): string => {
  return colord(color).desaturate(amount).toHex();
};

/**
 * Satura un color por un factor (0-1)
 */
export const saturateColor = (color: string, amount: number = 0.1): string => {
  return colord(color).saturate(amount).toHex();
};

/**
 * Rota el matiz de un color por grados (0-360)
 */
export const rotateHue = (color: string, degrees: number): string => {
  return colord(color).rotate(degrees).toHex();
};

/**
 * Obtiene la luminancia del color (0-1)
 */
export const getLuminance = (color: string): number => {
  return colord(color).luminance();
};

/**
 * Calcula el ratio de contraste entre dos colores (WCAG)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const c1 = colord(color1);
  const c2 = colord(color2);

  const l1 = c1.luminance();
  const l2 = c2.luminance();

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Verifica si el color es legible (accesible) sobre un fondo
 */
export const isReadable = (foreground: string, background: string): boolean => {
  return colord(foreground).isReadable(background);
};

/**
 * Generates a theme variant (Dark Mode) based on a base color (Light Mode).
 * Uses a heuristic to invert lightness while preserving hue, with slight desaturation for dark mode.
 */
export const generateThemeVariant = (baseColor: string): string => {
  const c = colord(baseColor);
  const hsl = c.toHsl();

  // Invert lightness: 100% - L
  // We can also clamp it to avoid pure black/white if desired,
  // but simple inversion is a good starting point for a "related" color.
  // For dark mode, we often want slightly less saturation to reduce eye strain.

  const newL = 100 - hsl.l;
  const newS = Math.max(0, hsl.s * 0.8); // 80% saturation of the original

  return colord({ h: hsl.h, s: newS, l: newL }).toHex();
};
