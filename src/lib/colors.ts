import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import harmoniesPlugin from "colord/plugins/harmonies";

extend([a11yPlugin, harmoniesPlugin]);

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
    complementary: c.harmonies("complementary").map(c => c.toHex()),
    analogous: c.harmonies("analogous").map(c => c.toHex()),
    triadic: c.harmonies("triadic").map(c => c.toHex()),
    splitComplementary: c.harmonies("split-complementary").map(c => c.toHex()),
    tetradic: c.harmonies("tetradic").map(c => c.toHex()),
    rectangle: c.harmonies("rectangle").map(c => c.toHex()),
  };
};