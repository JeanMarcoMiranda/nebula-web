"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { useTheme } from "next-themes";
import { CSSProperties } from "react";
import { COLOR_ROLES } from "@/lib/paletteGenerator";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

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
 * Returns a contrasting foreground color (white/black) for a given background hex.
 * Uses strict WCAG contrast ratio comparison rather than simple luminance.
 * Exported so ThemePreview can compute contrast text colors on concrete hex values.
 */
export function computeForeground(hex: string): string {
  if (!hex || !hex.startsWith("#")) return "#09090b";
  const c = colord(hex);
  const contrastWhite = c.contrast("#ffffff");
  const contrastBlack = c.contrast("#000000");

  // Prefer white if it meets AAA (7) or AA (4.5), otherwise pick whichever is higher
  if (contrastWhite >= 4.5) return "#ffffff";
  if (contrastBlack >= 4.5) return "#09090b";
  return contrastWhite > contrastBlack ? "#ffffff" : "#09090b";
}

/**
 * Derives structural design tokens (background, card, border…)
 * from the primary palette color.
 */
function deriveStructuralTokens(
  primaryHex: string,
  isDark: boolean,
): Record<string, string> {
  const { h, s } = colord(primaryHex).toHsl();

  if (isDark) {
    // Premium Dark Mode: Deeply tinted background, not just grey
    // Low lightness (4-6%), low-mid saturation (10-20%) derived from primary hue
    const bg = colord({ h, s: Math.min(s * 0.3, 15), l: 5 }).toHex();
    const card = colord({ h, s: Math.min(s * 0.3, 15), l: 12 }).toHex();

    // Border should be subtle but visible.
    // Using a higher lightness tint of the hue to create a "glowing" border effect separately
    const border = colord({ h, s: Math.min(s * 0.3, 15), l: 18 }).toHex();

    return {
      "--background": bg,
      "--foreground": "#fafafa",
      "--card": card,
      "--card-foreground": "#fafafa",
      "--popover": card, // Popovers match cards
      "--popover-foreground": "#fafafa",
      "--primary-foreground": computeForeground(primaryHex),
      "--secondary": colord({ h, s: Math.min(s * 0.3, 15), l: 15 }).toHex(),
      "--secondary-foreground": "#fafafa",
      "--muted": colord({ h, s: Math.min(s * 0.3, 15), l: 15 }).toHex(),
      "--muted-foreground": "#a1a1aa",
      "--accent": colord({ h, s: Math.min(s * 0.5, 25), l: 20 }).toHex(),
      "--accent-foreground": "#fafafa",
      "--border": border,
      "--input": border,
      "--destructive": "#7f1d1d",
      "--destructive-foreground": "#fafafa",
    };
  } else {
    // Clean Light Mode: Very subtle tint or pure white
    // High lightness (98%), very low saturation (3-8%)
    const bg = colord({ h, s: Math.min(s * 0.2, 8), l: 98 }).toHex();

    // Cards pure white for maximum clean contrast
    const card = "#ffffff";

    const border = colord({ h, s: Math.min(s * 0.2, 10), l: 90 }).toHex();

    return {
      "--background": bg,
      "--foreground": "#09090b",
      "--card": card,
      "--card-foreground": "#09090b",
      "--popover": card,
      "--popover-foreground": "#09090b",
      "--primary-foreground": computeForeground(primaryHex),
      "--secondary": colord({ h, s: Math.min(s * 0.2, 12), l: 94 }).toHex(),
      "--secondary-foreground": "#09090b",
      "--muted": colord({ h, s: Math.min(s * 0.1, 8), l: 94 }).toHex(),
      "--muted-foreground": "#71717a",
      "--accent": colord({ h, s: Math.min(s * 0.2, 12), l: 94 }).toHex(),
      "--accent-foreground": "#09090b",
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

  // Structural tokens derived from primary (provides defaults for bg, card, border, etc.)
  const primary = colors[0];
  if (primary) {
    const structural = deriveStructuralTokens(primary[mode], isDark);
    Object.assign(vars, structural);
  }

  // Palette role colors explicit overrides
  // If the palette has a specific "secondary" or "muted", it overrides the structural defaults
  colors.forEach((color, index) => {
    const role = COLOR_ROLES[index];
    if (!role) return;
    const hex = color[mode];
    setVar(`--${role}`, hex);
    setVar(`--${role}-foreground`, computeForeground(hex));
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
