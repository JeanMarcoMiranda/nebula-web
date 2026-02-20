"use client";

import { usePaletteStore } from "@/store/usePaletteStore";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Moon, Sun, Sparkles } from "lucide-react";
import { ThemeScope } from "@/components/ThemeSynchronizer";
import { computeForeground } from "@/components/ThemeSynchronizer";
import { COLOR_ROLES, ROLE_META, ColorRole } from "@/lib/paletteGenerator";
import { useState, useMemo } from "react";
import { colord } from "colord";

// ─── Color Utilities ──────────────────────────────────────────────────────────

/**
 * Given a background hex, returns a guaranteed-readable text color.
 * Uses WCAG AA (4.5:1) as minimum threshold.
 */
function getContrastText(bgHex: string): string {
  return computeForeground(bgHex);
}

/**
 * Derives a subtle tinted surface color from a palette hex.
 * Used for section backgrounds — keeps the palette hue visible but very muted.
 * @param hex       - Base color from palette
 * @param isDark    - Current theme mode
 * @param strength  - How prominent the tint is (0–1, default 0.08 light / 0.12 dark)
 */
function deriveSurface(
  hex: string,
  isDark: boolean,
  strength?: number,
): string {
  const { h, s } = colord(hex).toHsl();
  const alpha = strength ?? (isDark ? 0.12 : 0.08);
  if (isDark) {
    // Tinted dark surface
    return colord({ h, s: Math.min(s * 0.4, 20), l: 5 + alpha * 100 }).toHex();
  } else {
    // Very light tinted surface
    return colord({ h, s: Math.min(s * 0.3, 15), l: 98 - alpha * 100 }).toHex();
  }
}

/**
 * Returns a readable "accent on surface" color — the palette color itself
 * if it contrasts well against the surface, otherwise a darkened/lightened version.
 */
function ensureContrast(fgHex: string, bgHex: string, minRatio = 4.5): string {
  let color = colord(fgHex);
  const bg = colord(bgHex);
  let ratio = color.contrast(bg);
  if (ratio >= minRatio) return fgHex;

  // Try shifting lightness in steps of 5 until we hit the target
  const bgIsLight = bg.isLight();
  for (let step = 1; step <= 12; step++) {
    const adjusted = bgIsLight
      ? color.darken(step * 0.06)
      : color.lighten(step * 0.06);
    ratio = adjusted.contrast(bg);
    if (ratio >= minRatio) return adjusted.toHex();
    color = adjusted;
  }
  // Hard fallback
  return bgIsLight ? "#09090b" : "#fafafa";
}

/**
 * Derives roles to use for each palette size.
 * Returns which palette slots should be used for which UI purposes.
 */
function getRoleMapping(count: number): {
  primary: number;
  secondary: number | null;
  accent: number | null;
  muted: number | null;
  surface: number; // index of color to use for section bg tints
} {
  switch (count) {
    case 3:
      return { primary: 0, secondary: 1, accent: 2, muted: null, surface: 1 };
    case 4:
      return { primary: 0, secondary: 1, accent: 2, muted: 3, surface: 3 };
    case 5:
    case 6:
    default:
      return { primary: 0, secondary: 1, accent: 2, muted: 3, surface: 3 };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  primaryHex,
  bgHex,
}: {
  number: string;
  title: string;
  primaryHex: string;
  bgHex: string;
}) {
  const numberColor = ensureContrast(primaryHex, bgHex, 4.5);
  const titleColor = getContrastText(bgHex);
  const borderColor = colord(titleColor).alpha(0.12).toHex();

  return (
    <div className="flex items-center gap-4 mb-8">
      <span
        className="font-mono text-sm font-semibold"
        style={{ color: numberColor }}
      >
        {number}
      </span>
      <h2
        className="text-sm font-medium tracking-[0.2em] uppercase"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: borderColor }} />
    </div>
  );
}

// ─── ThemePreview ─────────────────────────────────────────────────────────────

export function ThemePreview() {
  const {
    colors,
    schemeName,
    schemeDescription,
    schemeMood,
    schemeUseCases,
    schemeTags,
  } = usePaletteStore();

  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const isDark = previewTheme === "dark";

  // ── Derive concrete hex values ───────────────────────────────────────────
  // We work with real hex throughout so contrast can be computed in JS.
  const hexes = useMemo(() => {
    const mode = isDark ? "darkHex" : "lightHex";
    return colors.map((c) => c[mode]);
  }, [colors, isDark]);

  const roleMap = useMemo(() => getRoleMapping(colors.length), [colors.length]);

  // Structural colors derived for the outer wrapper (same logic as ThemeSynchronizer)
  const bgHex = useMemo(() => {
    const primary = hexes[0] ?? "#6366f1";
    const { h, s } = colord(primary).toHsl();
    if (isDark) {
      return colord({ h, s: Math.min(s * 0.3, 15), l: 5 }).toHex();
    } else {
      return colord({ h, s: Math.min(s * 0.2, 8), l: 98 }).toHex();
    }
  }, [hexes, isDark]);

  const cardHex = useMemo(() => {
    const primary = hexes[0] ?? "#6366f1";
    const { h, s } = colord(primary).toHsl();
    if (isDark) {
      return colord({ h, s: Math.min(s * 0.3, 15), l: 12 }).toHex();
    } else {
      return "#ffffff";
    }
  }, [hexes, isDark]);

  const borderHex = useMemo(() => {
    const primary = hexes[0] ?? "#6366f1";
    const { h, s } = colord(primary).toHsl();
    if (isDark) {
      return colord({ h, s: Math.min(s * 0.3, 15), l: 18 }).toHex();
    } else {
      return colord({ h, s: Math.min(s * 0.2, 10), l: 90 }).toHex();
    }
  }, [hexes, isDark]);

  const fgHex = isDark ? "#fafafa" : "#09090b";
  const mutedFgHex = isDark ? "#a1a1aa" : "#71717a";

  const primaryHex = hexes[0] ?? "#6366f1";
  const primaryFg = getContrastText(primaryHex);

  // Surface for section info panels — use muted/secondary tinted
  const surfaceHex = useMemo(() => {
    const surfaceBase = hexes[roleMap.surface] ?? hexes[0] ?? primaryHex;
    return deriveSurface(surfaceBase, isDark, isDark ? 0.14 : 0.1);
  }, [hexes, roleMap, isDark, primaryHex]);

  const surfaceFg = getContrastText(surfaceHex);

  // Frame header background
  const frameHeaderBg = deriveSurface(primaryHex, isDark, isDark ? 0.12 : 0.06);

  // ── Box shadow ───────────────────────────────────────────────────────────
  const boxShadow = isDark
    ? "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px -16px rgba(0,0,0,0.6)"
    : "0 0 0 1px rgba(0,0,0,0.05), 0 32px 64px -16px rgba(0,0,0,0.12)";

  return (
    <div className="w-full flex flex-col gap-[var(--spacing-section)]">
      <ThemeScope
        forcedTheme={previewTheme}
        className="relative rounded-3xl overflow-hidden border transition-all duration-500"
      >
        <div
          style={{
            backgroundColor: bgHex,
            color: fgHex,
            boxShadow,
          }}
        >
          {/* ── Frame Header / Controls ───────────────────────────────── */}
          <div
            className="flex items-center justify-between px-8 py-4 border-b"
            style={{
              borderColor: borderHex,
              backgroundColor: frameHeaderBg,
            }}
          >
            {/* Browser chrome dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>

            {/* URL bar hint */}
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono"
              style={{
                backgroundColor: isDark
                  ? colord(borderHex).alpha(0.5).toHex()
                  : colord(borderHex).alpha(0.8).toHex(),
                color: mutedFgHex,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: primaryHex }}
              />
              yourapp.com
            </div>

            {/* Light / Dark toggle */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium"
                style={{ color: mutedFgHex }}
              >
                Preview
              </span>
              <button
                onClick={() => setPreviewTheme(isDark ? "light" : "dark")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={{
                  backgroundColor: surfaceHex,
                  color: surfaceFg,
                  border: `1px solid ${borderHex}`,
                }}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Preview Content ───────────────────────────────────────── */}
          <div className="w-full flex flex-col gap-[var(--spacing-macro)] px-8 md:px-16 py-16 md:py-20">
            {/* ══ PALETTE INFO PANEL ════════════════════════════════════ */}
            <section
              className="rounded-2xl border p-6 md:p-8 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700"
              style={{
                borderColor: borderHex,
                backgroundColor: surfaceHex,
              }}
            >
              {/* Label row */}
              <div className="flex items-center gap-2">
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: ensureContrast(primaryHex, surfaceHex, 4.5) }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: ensureContrast(primaryHex, surfaceHex, 4.5) }}
                >
                  Active Palette
                </span>
              </div>

              {/* Name + Description */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                <div className="flex flex-col gap-2 flex-1">
                  <h3
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: surfaceFg }}
                  >
                    {schemeName}
                  </h3>
                  <p
                    className="text-sm leading-relaxed max-w-2xl"
                    style={{ color: colord(surfaceFg).alpha(0.7).toHex() }}
                  >
                    {schemeDescription}
                  </p>
                </div>
                {/* Mood */}
                <div className="flex flex-col gap-1 shrink-0">
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: colord(surfaceFg).alpha(0.5).toHex() }}
                  >
                    Mood
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colord(surfaceFg).alpha(0.8).toHex() }}
                  >
                    {schemeMood}
                  </span>
                </div>
              </div>

              {/* Tags + Use Cases */}
              <div className="flex flex-wrap gap-2">
                {schemeTags.map((tag) => {
                  const tagBg = ensureContrast(primaryHex, surfaceHex, 4.5);
                  const tagSurface = colord(primaryHex).alpha(0.15).toHex();
                  return (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        borderColor: tagBg,
                        color: tagBg,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
                <span
                  className="h-5 w-px mx-1 self-center"
                  style={{
                    backgroundColor: colord(surfaceFg).alpha(0.2).toHex(),
                  }}
                />
                {schemeUseCases.map((uc) => {
                  const ucBg = colord(surfaceFg).alpha(0.1).toHex();
                  const ucFg = colord(surfaceFg).alpha(0.7).toHex();
                  return (
                    <span
                      key={uc}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: ucBg,
                        color: ucFg,
                      }}
                    >
                      {uc}
                    </span>
                  );
                })}
              </div>
            </section>

            {/* SECTION 1: TYPOGRAPHY */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <SectionHeader
                number="01"
                title="Typography"
                primaryHex={primaryHex}
                bgHex={bgHex}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-baseline">
                <div className="space-y-6">
                  <h1
                    className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85]"
                    style={{ color: fgHex }}
                  >
                    Visual
                    <br />
                    <span
                      style={{ color: ensureContrast(primaryHex, bgHex, 4.5) }}
                    >
                      Clarity.
                    </span>
                  </h1>
                  <p
                    className="text-xl font-light max-w-md leading-relaxed"
                    style={{ color: mutedFgHex }}
                  >
                    Typography is the voice of your design. Use it to create
                    hierarchy and guide the user&apos;s eye through the content.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      label: "Headline 2",
                      cls: "text-4xl font-bold tracking-tight",
                    },
                    {
                      label: "Headline 3",
                      cls: "text-2xl font-semibold tracking-tight",
                    },
                    { label: "Body", cls: "text-base leading-relaxed" },
                  ].map(({ label, cls }) => (
                    <div key={label} className="space-y-2">
                      <span
                        className="text-xs font-mono uppercase tracking-widest"
                        style={{ color: mutedFgHex }}
                      >
                        {label}
                      </span>
                      <p className={cls} style={{ color: fgHex }}>
                        {label === "Body"
                          ? "Minimalism is not about removing the things you love. It\u2019s about removing the things that distract you from what matters."
                          : label === "Headline 2"
                            ? "The quick brown fox"
                            : "Jumps over the lazy dog"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: PALETTE */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <SectionHeader
                number="02"
                title="Palette"
                primaryHex={primaryHex}
                bgHex={bgHex}
              />

              {/* Color band */}
              <div
                className="grid h-32 md:h-44 rounded-2xl overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))`,
                  boxShadow: isDark
                    ? "inset 0 0 0 1px rgba(255,255,255,0.1)"
                    : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {hexes.map((hex, i) => {
                  const labelBg = isDark
                    ? "rgba(0,0,0,0.75)"
                    : "rgba(255,255,255,0.85)";
                  const labelFg = isDark ? "#fafafa" : "#09090b";
                  return (
                    <div
                      key={colors[i].id}
                      className="h-full flex flex-col items-center justify-end pb-5 relative group"
                      style={{ backgroundColor: hex }}
                    >
                      {/* Hex label on hover */}
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm"
                        style={{
                          backgroundColor: labelBg,
                          color: labelFg,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {hex}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Role labels row — truncated on mobile */}
              <div
                className="hidden sm:flex justify-between text-xs font-mono uppercase tracking-wider px-1"
                style={{ color: mutedFgHex }}
              >
                {colors.map((_, i) => (
                  <span key={i} className="capitalize">
                    {COLOR_ROLES[i]}
                  </span>
                ))}
              </div>

              {/* ── Role detail cards ─────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {colors.map((color, i) => {
                  const role = COLOR_ROLES[i] as ColorRole;
                  const meta = ROLE_META[role];
                  const hex = hexes[i];

                  // Compute readable pill colors using the card background as reference
                  const pillBg = colord(hex).alpha(0.18).toHex();
                  // For pill text: use the hex itself if it contrasts with cardHex, else adjust
                  const pillFg = ensureContrast(hex, cardHex, 4.5);

                  return (
                    <div
                      key={color.id}
                      className="rounded-xl p-5 flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                      style={{
                        borderColor: borderHex,
                        backgroundColor: cardHex,
                      }}
                    >
                      {/* Color swatch + hex */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg shrink-0"
                          style={{
                            backgroundColor: hex,
                            outline: `1px solid ${borderHex}`,
                          }}
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: getContrastText(cardHex) }}
                          >
                            {meta.label}
                          </span>
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: mutedFgHex }}
                          >
                            {hex}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: colord(getContrastText(cardHex))
                            .alpha(0.65)
                            .toHex(),
                        }}
                      >
                        {meta.description}
                      </p>

                      {/* UI uses */}
                      <div className="flex flex-wrap gap-1">
                        {meta.uiUses.slice(0, 3).map((use) => (
                          <span
                            key={use}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: pillBg,
                              color: pillFg,
                            }}
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3: INTERFACE */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <SectionHeader
                number="03"
                title="Interface"
                primaryHex={primaryHex}
                bgHex={bgHex}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                {/* Column 1: Actions & Inputs */}
                <div className="space-y-12">
                  {/* Buttons */}
                  <div className="space-y-6">
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: mutedFgHex }}
                    >
                      Actions
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {/* Primary CTA — use palette primary directly */}
                      <button
                        className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: primaryHex,
                          color: primaryFg,
                        }}
                      >
                        Primary Action
                      </button>

                      {/* Secondary — derived secondary/muted */}
                      <button
                        className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: deriveSurface(
                            primaryHex,
                            isDark,
                            isDark ? 0.2 : 0.12,
                          ),
                          color: fgHex,
                          border: `1px solid ${borderHex}`,
                        }}
                      >
                        Secondary
                      </button>

                      {/* Outline */}
                      <button
                        className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: "transparent",
                          color: ensureContrast(primaryHex, bgHex, 4.5),
                          border: `1.5px solid ${ensureContrast(primaryHex, bgHex, 4.5)}`,
                        }}
                      >
                        Outline
                      </button>

                      {/* Ghost */}
                      <button
                        className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-70 active:scale-95"
                        style={{
                          backgroundColor: "transparent",
                          color: fgHex,
                        }}
                      >
                        Ghost
                      </button>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-6">
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: mutedFgHex }}
                    >
                      Inputs
                    </h4>
                    <div className="grid gap-6 max-w-sm">
                      <div className="grid gap-2">
                        <label
                          className="text-sm font-medium"
                          style={{ color: fgHex }}
                        >
                          Email Address
                        </label>
                        <input
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                          style={{
                            backgroundColor: deriveSurface(
                              primaryHex,
                              isDark,
                              isDark ? 0.18 : 0.1,
                            ),
                            color: fgHex,
                            border: `1px solid ${borderHex}`,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = primaryHex;
                            e.target.style.boxShadow = `0 0 0 2px ${colord(primaryHex).alpha(0.25).toHex()}`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = borderHex;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-sm font-medium"
                          style={{ color: fgHex }}
                        >
                          Volume Control
                        </label>
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                      <div
                        className="flex items-center space-x-4 border p-4 rounded-xl"
                        style={{
                          borderColor: borderHex,
                          backgroundColor: cardHex,
                        }}
                      >
                        <div className="flex-1 space-y-1">
                          <p
                            className="text-sm font-medium"
                            style={{ color: getContrastText(cardHex) }}
                          >
                            Dark Mode
                          </p>
                          <p className="text-xs" style={{ color: mutedFgHex }}>
                            Switch appearance
                          </p>
                        </div>
                        <Switch
                          checked={isDark}
                          onCheckedChange={(c) =>
                            setPreviewTheme(c ? "dark" : "light")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Card */}
                <div className="space-y-12">
                  <h4
                    className="text-sm font-medium uppercase tracking-widest"
                    style={{ color: mutedFgHex }}
                  >
                    Composition
                  </h4>

                  <div
                    className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      borderColor: borderHex,
                      backgroundColor: cardHex,
                    }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Badge with accent color or primary */}
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold"
                          style={{
                            backgroundColor: hexes[roleMap.accent ?? 0]
                              ? colord(hexes[roleMap.accent ?? 0])
                                  .alpha(0.15)
                                  .toHex()
                              : colord(primaryHex).alpha(0.15).toHex(),
                            color: ensureContrast(
                              hexes[roleMap.accent ?? 0] ?? primaryHex,
                              cardHex,
                              4.5,
                            ),
                          }}
                        >
                          NEW
                        </span>
                        <span className="text-xs" style={{ color: mutedFgHex }}>
                          Just now
                        </span>
                      </div>
                      <div>
                        <h3
                          className="text-2xl font-bold tracking-tight"
                          style={{ color: getContrastText(cardHex) }}
                        >
                          Minimalist Card
                        </h3>
                        <p
                          className="text-sm mt-1 leading-relaxed"
                          style={{
                            color: colord(getContrastText(cardHex))
                              .alpha(0.65)
                              .toHex(),
                          }}
                        >
                          Cards group related information. Keep distinct
                          boundaries but avoid heavy shadows.
                        </p>
                      </div>

                      {/* Thumbnail placeholder using accent/secondary */}
                      <div
                        className="h-32 rounded-xl flex items-center justify-center border border-dashed"
                        style={{
                          backgroundColor: deriveSurface(
                            hexes[roleMap.secondary ?? 0] ?? primaryHex,
                            isDark,
                            0.1,
                          ),
                          borderColor: borderHex,
                        }}
                      >
                        <div
                          className="h-8 w-8 rounded-full animate-pulse"
                          style={{
                            backgroundColor: primaryHex,
                            opacity: 0.5,
                          }}
                        />
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: mutedFgHex }}>Progress</span>
                          <span
                            className="font-medium"
                            style={{ color: getContrastText(cardHex) }}
                          >
                            75%
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full rounded-full overflow-hidden"
                          style={{
                            backgroundColor: deriveSurface(
                              primaryHex,
                              isDark,
                              0.15,
                            ),
                          }}
                        >
                          <div
                            className="h-full w-3/4 rounded-full"
                            style={{ backgroundColor: primaryHex }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className="px-6 py-4 border-t"
                      style={{ borderColor: borderHex }}
                    >
                      <button
                        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.99] group"
                        style={{
                          backgroundColor: primaryHex,
                          color: primaryFg,
                        }}
                      >
                        Continue{" "}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Badges & misc */}
                  <div className="space-y-4">
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: mutedFgHex }}
                    >
                      Badges
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {/* Each badge uses a different palette color */}
                      {hexes.slice(0, 4).map((hex, i) => {
                        const roles = [
                          "Primary",
                          "Secondary",
                          "Accent",
                          "Muted",
                        ];
                        const label = roles[i] ?? `Color ${i + 1}`;
                        const badgeFg = getContrastText(hex);
                        return (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: hex,
                              color: badgeFg,
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: borderHex,
                          color: fgHex,
                        }}
                      >
                        Outline
                      </span>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="space-y-4">
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: borderHex }}
                    />
                    <p
                      className="text-sm text-center"
                      style={{ color: mutedFgHex }}
                    >
                      Separator at full width
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: SURFACES */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <SectionHeader
                number="04"
                title="Surfaces"
                primaryHex={primaryHex}
                bgHex={bgHex}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hexes.map((hex, i) => {
                  const role = COLOR_ROLES[i] as ColorRole;
                  const meta = ROLE_META[role];

                  // Full color surface: use hex as background
                  const surfaceFgColor = getContrastText(hex);
                  const subTextColor = colord(surfaceFgColor)
                    .alpha(0.65)
                    .toHex();
                  const pillBg = colord(surfaceFgColor).alpha(0.15).toHex();

                  return (
                    <div
                      key={colors[i].id}
                      className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      style={{
                        backgroundColor: hex,
                        minHeight: "160px",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <span
                          className="text-xs font-mono uppercase tracking-widest font-semibold"
                          style={{
                            color: colord(surfaceFgColor).alpha(0.6).toHex(),
                          }}
                        >
                          {meta.label}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: pillBg,
                            color: surfaceFgColor,
                          }}
                        >
                          {hex}
                        </span>
                      </div>
                      <p
                        className="text-sm font-medium leading-snug mt-auto"
                        style={{ color: surfaceFgColor }}
                      >
                        {meta.description.split(".")[0]}.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {meta.uiUses.slice(0, 2).map((use) => (
                          <span
                            key={use}
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: pillBg,
                              color: surfaceFgColor,
                            }}
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradient strip using all palette colors */}
              <div
                className="rounded-2xl overflow-hidden h-16 relative"
                style={{
                  background: `linear-gradient(to right, ${hexes.join(", ")})`,
                  boxShadow: isDark
                    ? "inset 0 0 0 1px rgba(255,255,255,0.1)"
                    : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs font-mono tracking-widest uppercase px-4 py-1.5 rounded-full"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(0,0,0,0.5)"
                        : "rgba(255,255,255,0.6)",
                      color: isDark ? "#fafafa" : "#09090b",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Palette Gradient
                  </span>
                </div>
              </div>

              {/* Subtle tinted surfaces row — shows how palette colors work as bg tints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hexes.map((hex, i) => {
                  const tintBg = deriveSurface(
                    hex,
                    isDark,
                    isDark ? 0.14 : 0.08,
                  );
                  const tintFg = getContrastText(tintBg);
                  const accentFg = ensureContrast(hex, tintBg, 4.5);
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-4 border"
                      style={{
                        backgroundColor: tintBg,
                        borderColor: borderHex,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full mb-2"
                        style={{ backgroundColor: hex }}
                      />
                      <p
                        className="text-xs font-semibold"
                        style={{ color: accentFg }}
                      >
                        Tinted Surface
                      </p>
                      <p
                        className="text-[10px] mt-0.5 font-mono"
                        style={{ color: colord(tintFg).alpha(0.55).toHex() }}
                      >
                        {COLOR_ROLES[i]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </ThemeScope>
    </div>
  );
}
