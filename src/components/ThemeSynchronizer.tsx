"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { useTheme } from "next-themes";
import { CSSProperties } from "react";
import { COLOR_ROLES } from "@/lib/paletteGenerator";

interface ThemeScopeProps {
  children: React.ReactNode;
  forcedTheme?: "light" | "dark";
}

export function ThemeScope({ children, forcedTheme }: ThemeScopeProps) {
  const { colors } = usePaletteStore();
  const { theme, systemTheme } = useTheme();

  const currentTheme =
    forcedTheme || (theme === "system" ? systemTheme : theme);
  const isDark = currentTheme === "dark";
  const mode = isDark ? "darkHex" : "lightHex";

  const style: CSSProperties & Record<string, string> = {};

  const setVar = (name: string, value: string) => {
    if (value && value.startsWith("#")) {
      style[name] = value;
    }
  };

  // Apply CSS vars for however many colors exist (works for 3–6)
  colors.forEach((color, index) => {
    const role = COLOR_ROLES[index];
    if (!role) return;
    setVar(`--${role}`, color[mode]);
  });

  // Map chart vars to the available colors (cycle if fewer than 5)
  const chartCount = 5;
  for (let i = 0; i < chartCount; i++) {
    const color = colors[i % colors.length];
    if (color) setVar(`--chart-${i + 1}`, color[mode]);
  }

  // For missing semantic roles (when palette < 5), fall back to nearest color
  // This ensures --primary, --secondary, --accent, --muted, --ring are always set
  const fallbackOrder = [0, 1, 2, 0, 0]; // indices to fall back to for each role
  COLOR_ROLES.slice(0, 5).forEach((role, i) => {
    if (!colors[i]) {
      const fallback = colors[fallbackOrder[i]] ?? colors[0];
      if (fallback) setVar(`--${role}`, fallback[mode]);
    }
  });

  return (
    <div style={style as CSSProperties} className="contents">
      {children}
    </div>
  );
}
