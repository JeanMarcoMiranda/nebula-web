import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

export const generateRandomHex = () => {
  return colord({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }).toHex();
};

export const getContrastColor = (color: string) => {
  return colord(color).isDark() ? "#ffffff" : "#000000";
};

export const isValidHex = (color: string) => {
  return colord(color).isValid();
};

export const getHarmonies = (color: string) => {
  const c = colord(color);
  return {
    complementary: c.complement().toHex(),
    analogous: c.reorder(({ s, l }) => ({ h: (c.toHsl().h + 30) % 360, s, l })).toHex(),
    triadic: c.reorder(({ s, l }) => ({ h: (c.toHsl().h + 120) % 360, s, l })).toHex(),
  };
};