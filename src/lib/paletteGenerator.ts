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
  mood: string;
  useCases: string[];
  tags: string[];
  colors: Record<ColorRole, { light: string; dark: string }>;
}

// ─── Strategy Metadata ────────────────────────────────────────────────────────

export const STRATEGY_META: Record<
  ColorStrategy,
  {
    label: string;
    description: string;
    mood: string;
    useCases: string[];
    tags: string[];
  }
> = {
  monochromatic: {
    label: "Monochromatic",
    description:
      "A single hue across multiple shades and tints. Creates a clean, professional look with minimal visual tension — ideal for brand-focused interfaces where consistency is key.",
    mood: "Calm · Focused · Professional",
    useCases: ["Dashboards", "SaaS products", "Corporate sites", "Mobile apps"],
    tags: ["Minimal", "Cohesive", "Elegant"],
  },
  analogous: {
    label: "Analogous",
    description:
      "Colors adjacent on the color wheel (±30°). Inherently harmonious and found in nature, this palette feels warm and inviting, perfect for lifestyle or creative products.",
    mood: "Warm · Natural · Harmonious",
    useCases: ["Landing pages", "Portfolio sites", "E-commerce", "Travel apps"],
    tags: ["Natural", "Flowing", "Friendly"],
  },
  complementary: {
    label: "Complementary",
    description:
      "Opposite colors on the wheel (180°) create maximum contrast that draws attention. One color dominates while the other accents — great for CTAs and conversion-focused designs.",
    mood: "Bold · Dynamic · High-contrast",
    useCases: [
      "Marketing pages",
      "Call-to-action heavy sites",
      "Sports apps",
      "Fintech",
    ],
    tags: ["Vibrant", "Energetic", "High contrast"],
  },
  triadic: {
    label: "Triadic",
    description:
      "Three equidistant hues (120° apart) produce a diverse yet balanced look. Rich in color while retaining harmony — great for creative and playful interfaces.",
    mood: "Playful · Balanced · Creative",
    useCases: [
      "Kids apps",
      "Creative tools",
      "Entertainment platforms",
      "Games",
    ],
    tags: ["Colorful", "Balanced", "Versatile"],
  },
  "split-complementary": {
    label: "Split Complementary",
    description:
      "A base color plus two colors flanking its complement. Retains the visual interest of a complementary palette but with softer contrast — easier on the eye and more flexible.",
    mood: "Sophisticated · Confident · Refined",
    useCases: [
      "Lifestyle apps",
      "News platforms",
      "Social networks",
      "Productivity tools",
    ],
    tags: ["Soft contrast", "Sophisticated", "Flexible"],
  },
  tetradic: {
    label: "Tetradic",
    description:
      "Four colors in two complementary pairs (rectangle on the wheel). The richest multi-hue palette — highly expressive and suited for interfaces with distinct content zones.",
    mood: "Rich · Expressive · Complex",
    useCases: [
      "Design systems",
      "Data visualization",
      "Complex dashboards",
      "Multi-brand platforms",
    ],
    tags: ["Multi-hue", "Expressive", "Structured"],
  },
};

// ─── Role Metadata ─────────────────────────────────────────────────────────────

export const ROLE_META: Record<
  ColorRole,
  {
    label: string;
    description: string;
    uiUses: string[];
  }
> = {
  primary: {
    label: "Primary",
    description:
      "The dominant brand color. Sets the overall tone and identity of the interface.",
    uiUses: ["CTAs", "Hero sections", "Active states", "Navigation highlights"],
  },
  secondary: {
    label: "Secondary",
    description:
      "Supports the primary color. Used for backgrounds, cards, and secondary actions without competing for attention.",
    uiUses: ["Card backgrounds", "Secondary buttons", "Sidebars", "Surfaces"],
  },
  accent: {
    label: "Accent",
    description:
      "A contrasting pop of color that draws the eye to key moments in the UI.",
    uiUses: ["Badges", "Tags", "Highlights", "Notification dots", "Tooltips"],
  },
  muted: {
    label: "Muted",
    description:
      "A desaturated background tone for low-emphasis areas. Reduces visual noise and adds depth.",
    uiUses: [
      "Body text areas",
      "Placeholders",
      "Disabled states",
      "Code blocks",
    ],
  },
  ring: {
    label: "Focus Ring",
    description:
      "Used exclusively for keyboard focus indicators to ensure accessibility and clear interaction feedback.",
    uiUses: [
      "Focus outlines",
      "Selected states",
      "Keyboard navigation",
      "Active inputs",
    ],
  },
  tertiary: {
    label: "Tertiary",
    description:
      "An optional additional hue for richer palettes, used in data visualization, charts, or supporting design elements.",
    uiUses: [
      "Charts",
      "Data visualization",
      "Decorative elements",
      "Gradient stops",
    ],
  },
};

// ─── Color Generation ──────────────────────────────────────────────────────────

/**
 * Generates a UI-optimized base color.
 * - Saturation: 55–80% (avoids both greys and neons)
 * - Lightness:  40–60% (mid-range for versatile light/dark derivation)
 */
function generateUIFriendlyBase(): string {
  const h = Math.random() * 360;
  const s = 55 + Math.random() * 25; // 55–80%
  const l = 40 + Math.random() * 20; // 40–60%
  return colord({ h, s, l }).toHex();
}

/**
 * Clamps a value between min and max.
 */
function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Generates a monochromatic palette.
 * Single hue; lightness/saturation vary per role for clear hierarchy.
 */
function generateMonochromatic(baseColor: string): string[] {
  const { h, s } = colord(baseColor).toHsl();
  return [
    colord({ h, s: clamp(s, 55, 80), l: 50 }).toHex(), // primary
    colord({ h, s: clamp(s * 0.55, 20, 45), l: 62 }).toHex(), // secondary
    colord({ h, s: clamp(s * 1.05, 60, 90), l: 52 }).toHex(), // accent
    colord({ h, s: clamp(s * 0.2, 8, 20), l: 72 }).toHex(), // muted
    colord({ h, s: clamp(s, 55, 80), l: 48 }).toHex(), // ring
    colord({ h, s: clamp(s * 0.75, 35, 65), l: 42 }).toHex(), // tertiary
  ];
}

/**
 * Generates an analogous palette (±30° on the color wheel).
 */
function generateAnalogous(baseColor: string): string[] {
  const { h, s, l } = colord(baseColor).toHsl();
  return [
    baseColor, // primary
    colord({
      h: (h + 30) % 360,
      s: clamp(s * 0.85, 40, 75),
      l: clamp(l, 42, 62),
    }).toHex(), // secondary
    colord({
      h: (h - 30 + 360) % 360,
      s: clamp(s * 1.05, 55, 88),
      l: clamp(l, 42, 60),
    }).toHex(), // accent
    colord({ h, s: clamp(s * 0.2, 8, 18), l: 70 }).toHex(), // muted
    baseColor, // ring
    colord({
      h: (h + 15) % 360,
      s: clamp(s * 0.9, 40, 70),
      l: clamp(l * 0.88, 35, 55),
    }).toHex(), // tertiary
  ];
}

/**
 * Generates a complementary palette (180° opposite).
 */
function generateComplementary(baseColor: string): string[] {
  const { h, s, l } = colord(baseColor).toHsl();
  const comp = (h + 180) % 360;
  return [
    baseColor, // primary
    colord({ h, s: clamp(s * 0.55, 20, 45), l: clamp(l + 10, 50, 68) }).toHex(), // secondary
    colord({
      h: comp,
      s: clamp(s * 0.95, 50, 85),
      l: clamp(l, 42, 60),
    }).toHex(), // accent
    colord({ h, s: clamp(s * 0.15, 6, 16), l: 72 }).toHex(), // muted
    baseColor, // ring
    colord({
      h: comp,
      s: clamp(s * 0.65, 30, 60),
      l: clamp(l + 8, 48, 65),
    }).toHex(), // tertiary
  ];
}

/**
 * Generates a triadic palette (120° equidistant).
 */
function generateTriadic(baseColor: string): string[] {
  const { h, s, l } = colord(baseColor).toHsl();
  return [
    baseColor, // primary
    colord({
      h: (h + 120) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // secondary
    colord({
      h: (h + 240) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // accent
    colord({ h, s: clamp(s * 0.2, 8, 18), l: 72 }).toHex(), // muted
    baseColor, // ring
    colord({
      h: (h + 60) % 360,
      s: clamp(s * 0.75, 35, 65),
      l: clamp(l * 0.9, 36, 56),
    }).toHex(), // tertiary
  ];
}

/**
 * Generates a split-complementary palette.
 */
function generateSplitComplementary(baseColor: string): string[] {
  const { h, s, l } = colord(baseColor).toHsl();
  const comp = (h + 180) % 360;
  return [
    baseColor, // primary
    colord({
      h: (comp + 30) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // secondary
    colord({
      h: (comp - 30 + 360) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // accent
    colord({ h, s: clamp(s * 0.18, 6, 16), l: 72 }).toHex(), // muted
    baseColor, // ring
    colord({
      h: comp,
      s: clamp(s * 0.6, 28, 55),
      l: clamp(l + 10, 50, 68),
    }).toHex(), // tertiary
  ];
}

/**
 * Generates a tetradic (rectangular) palette.
 */
function generateTetradic(baseColor: string): string[] {
  const { h, s, l } = colord(baseColor).toHsl();
  return [
    baseColor, // primary
    colord({
      h: (h + 90) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // secondary
    colord({
      h: (h + 180) % 360,
      s: clamp(s * 0.9, 45, 80),
      l: clamp(l, 42, 60),
    }).toHex(), // accent
    colord({ h, s: clamp(s * 0.2, 8, 18), l: 72 }).toHex(), // muted
    baseColor, // ring
    colord({
      h: (h + 270) % 360,
      s: clamp(s * 0.85, 40, 75),
      l: clamp(l, 42, 60),
    }).toHex(), // tertiary
  ];
}

/**
 * Generates a dark-mode variant of a light-mode color.
 * - Light colors (l > 55): push to visible dark-mode range (38–52 L)
 * - Dark colors (l ≤ 55): push brighter so they're visible on dark backgrounds (55–72 L)
 * - Slightly desaturate (≈ −10%) to reduce eye fatigue
 */
function generateDarkVariant(lightColor: string): string {
  const { h, s, l } = colord(lightColor).toHsl();

  let newL: number;
  if (l > 55) {
    // Was light → use it slightly darkened; still needs to be visible on dark bg
    newL = clamp(38 + (100 - l) * 0.28, 36, 52);
  } else {
    // Was mid-tone → brighten for dark backgrounds
    newL = clamp(58 + l * 0.25, 55, 72);
  }

  const newS = clamp(s * 0.88, 30, 88); // ≈ −12% saturation

  return colord({ h, s: newS, l: newL }).toHex();
}

// ─── Main Export ───────────────────────────────────────────────────────────────

/**
 * Generates a full UI palette with the given strategy.
 * Always generates all 6 roles; the store slices to `paletteSize`.
 */
export function generateUIPalette(
  strategy: ColorStrategy = "analogous",
  baseColor?: string,
): UIColorScheme {
  const base = baseColor || generateUIFriendlyBase();
  const meta = STRATEGY_META[strategy];

  let colors: string[];

  switch (strategy) {
    case "monochromatic":
      colors = generateMonochromatic(base);
      break;
    case "analogous":
      colors = generateAnalogous(base);
      break;
    case "complementary":
      colors = generateComplementary(base);
      break;
    case "triadic":
      colors = generateTriadic(base);
      break;
    case "split-complementary":
      colors = generateSplitComplementary(base);
      break;
    case "tetradic":
      colors = generateTetradic(base);
      break;
    default:
      colors = generateAnalogous(base);
  }

  return {
    name: meta.label,
    description: meta.description,
    mood: meta.mood,
    useCases: meta.useCases,
    tags: meta.tags,
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
