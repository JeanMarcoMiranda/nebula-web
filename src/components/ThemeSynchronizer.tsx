"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { useTheme } from "next-themes";
import { CSSProperties } from "react";
import { COLOR_ROLES } from "@/lib/paletteGenerator";
import { colord } from "colord";

interface ThemeScopeProps {
  children: React.ReactNode;
  /**
   * When provided, the ThemeScope renders isolated from the global theme.
   * It applies the palette's `lightHex` or `darkHex` variants accordingly,
   * AND applies the `.dark` class so shadcn's `dark:` Tailwind variants
   * activate correctly — all on the SAME wrapper element.
   */
  forcedTheme?: "light" | "dark";
  className?: string;
}

/**
 * Returns a contrasting foreground color for a given background hex.
 * Uses the WCAG-standard 0.35 luminance threshold.
 */
function computeForeground(hex: string): string {
  if (!hex || !hex.startsWith("#")) return "#09090b";
  return colord(hex).luminance() > 0.35 ? "#09090b" : "#ffffff";
}

/**
 * Derives structural design tokens (background, card, border…)
 * from the primary palette color.
 */
function deriveStructuralTokens(
  primaryHex: string,
  isDark: boolean,
): Record<string, string> {
  const hsl = colord(primaryHex).toHsl();
  const h = hsl.h;
  const s = hsl.s;

  if (isDark) {
    const bg = colord({ h, s: Math.min(s * 0.15, 8), l: 5 }).toHex();
    const card = colord({ h, s: Math.min(s * 0.15, 8), l: 9 }).toHex();
    const border = colord({ h, s: Math.min(s * 0.2, 12), l: 18 }).toHex();
    return {
      "--background": bg,
      "--foreground": "#fafafa",
      "--card": card,
      "--card-foreground": "#fafafa",
      "--popover": card,
      "--popover-foreground": "#fafafa",
      "--primary-foreground": computeForeground(primaryHex),
      "--border": border,
      "--input": border,
      "--destructive": "#7f1d1d",
      "--destructive-foreground": "#fafafa",
    };
  } else {
    const bg = colord({ h, s: Math.min(s * 0.1, 6), l: 98 }).toHex();
    const border = colord({ h, s: Math.min(s * 0.2, 12), l: 88 }).toHex();
    return {
      "--background": bg,
      "--foreground": "#09090b",
      "--card": "#ffffff",
      "--card-foreground": "#09090b",
      "--popover": "#ffffff",
      "--popover-foreground": "#09090b",
      "--primary-foreground": computeForeground(primaryHex),
      "--border": border,
      "--input": border,
      "--destructive": "#ef4444",
      "--destructive-foreground": "#ffffff",
    };
  }
}

/**
 * Builds the full set of CSS custom properties for the palette, including
 * both color and their corresponding -foreground values.
 */
function buildPaletteVars(
  colors: ReturnType<typeof usePaletteStore.getState>["colors"],
  isDark: boolean,
): Record<string, string> {
  const mode = isDark ? "darkHex" : "lightHex";
  const vars: Record<string, string> = {};

  const setVar = (name: string, value: string) => {
    if (value?.startsWith("#")) vars[name] = value;
  };

  // Structural tokens derived from primary
  const primary = colors[0];
  if (primary) {
    const structural = deriveStructuralTokens(primary[mode], isDark);
    Object.assign(vars, structural);
  }

  // Palette role colors + their foregrounds
  colors.forEach((color, index) => {
    const role = COLOR_ROLES[index];
    if (!role) return;
    const hex = color[mode];
    setVar(`--${role}`, hex);
    setVar(`--${role}-foreground`, computeForeground(hex));
  });

  // Fallbacks for roles not provided by the current palette size
  const fallbackSources: Record<string, number> = {
    secondary: 0,
    accent: 1,
    ring: 0,
  };

  COLOR_ROLES.forEach((role, i) => {
    if (colors[i]) return; // already set

    if (role === "muted") {
      const base = colors[0];
      if (base) {
        const hex = base[mode];
        const mutedHex = isDark
          ? colord(hex).desaturate(0.6).darken(0.3).toHex()
          : colord(hex).desaturate(0.6).lighten(0.1).toHex();
        setVar("--muted", mutedHex);
        setVar("--muted-foreground", isDark ? "#a1a1aa" : "#71717a");
      }
      return;
    }

    const srcIdx = fallbackSources[role];
    if (srcIdx !== undefined) {
      const src = colors[srcIdx] ?? colors[0];
      if (src) {
        const hex = src[mode];
        setVar(`--${role}`, hex);
        setVar(`--${role}-foreground`, computeForeground(hex));
      }
    }
  });

  // Chart vars — cycle through palette
  for (let i = 0; i < 5; i++) {
    const color = colors[i % colors.length];
    if (color) setVar(`--chart-${i + 1}`, color[mode]);
  }

  // Ensure ring is always set
  if (!vars["--ring"] && primary) {
    setVar("--ring", primary[mode]);
  }

  return vars;
}

// ─── ThemeScope ──────────────────────────────────────────────────────────────

export function ThemeScope({
  children,
  forcedTheme,
  className,
}: ThemeScopeProps) {
  const { colors } = usePaletteStore();
  const { theme, systemTheme } = useTheme();

  const resolvedTheme =
    forcedTheme ?? (theme === "system" ? systemTheme : theme);
  const isDark = resolvedTheme === "dark";

  // Build all palette CSS vars
  const paletteVars = buildPaletteVars(colors, isDark);

  const style: CSSProperties & Record<string, string> = {
    colorScheme: isDark ? "dark" : "light",
    ...paletteVars,
  };

  /**
   * CRITICAL: The `.dark` class and the palette CSS vars MUST live on the
   * SAME element. If `.dark` is on a child and vars are on a parent (or
   * vice-versa), Tailwind's `dark:` utility classes will pick up the
   * globals.css static `.dark {}` values instead of our palette vars.
   *
   * We use `data-theme-scope` + forced class rather than relying on
   * next-themes so the global page theme is never touched.
   */
  return (
    <div
      data-theme-scope={resolvedTheme}
      className={`${isDark ? "dark" : ""} ${className ?? ""}`.trim()}
      style={style as CSSProperties}
    >
      {children}
    </div>
  );
}
