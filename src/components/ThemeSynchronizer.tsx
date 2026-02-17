"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { useTheme } from "next-themes";
import { CSSProperties } from "react";

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

  // Calculate the styles to apply
  const style: CSSProperties & Record<string, string> = {};

  if (colors.length >= 5) {
    const primary = colors[0];
    const secondary = colors[1];
    const accent = colors[2];
    const muted = colors[3];
    const ring = colors[4];

    const setVar = (name: string, value: string) => {
      // Simple check to ensure we don't break the theme with invalid values
      if (value && value.startsWith("#")) {
        style[name] = value;
      }
    };

    setVar("--primary", primary[mode]);
    setVar("--secondary", secondary[mode]);
    setVar("--accent", accent[mode]);
    setVar("--muted", muted[mode]);
    setVar("--ring", ring[mode]);

    setVar("--chart-1", primary[mode]);
    setVar("--chart-2", secondary[mode]);
    setVar("--chart-3", accent[mode]);
    setVar("--chart-4", muted[mode]);
    setVar("--chart-5", ring[mode]);
  }

  // Render a div with display: contents to apply variables without affecting layout structure significantly
  return (
    <div style={style as CSSProperties} className="contents">
      {children}
    </div>
  );
}
