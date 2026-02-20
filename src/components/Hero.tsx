"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Eye, Palette } from "lucide-react";

// ── Feature pills data ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Palette, label: "6 Color Strategies" },
  { icon: Zap, label: "Dark & Light Mode" },
  { icon: Eye, label: "Live UI Preview" },
];

// ── Hero ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const { generatePalette, setView, colors } = usePaletteStore();
  const hasPalette = colors.length > 0;

  return (
    <section className="pt-32 md:pt-44 pb-24 md:pb-32 px-8 max-w-screen-xl mx-auto flex flex-col gap-10">
      {/* ── Upper label chip ──────────────────────────────────────────── */}
      <div
        className="animate-in fade-in slide-in-from-bottom-3 duration-500"
        style={{ animationDelay: "0ms" }}
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 text-xs font-mono font-medium text-muted-foreground bg-secondary/40 backdrop-blur-sm select-none">
          <Sparkles className="w-3 h-3 text-primary" />
          Color Palette Generator · Free & Open Source
        </span>
      </div>

      {/* ── Headline ──────────────────────────────────────────────────── */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ animationDelay: "80ms" }}
      >
        <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-tighter text-foreground leading-[0.95]">
          Generate beautiful
          <br />
          <span className="text-primary">color palettes</span>
          <br className="hidden md:block" /> for your UI.
        </h1>
      </div>

      {/* ── Description ───────────────────────────────────────────────── */}
      <p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ animationDelay: "160ms" }}
      >
        Build harmonious palettes using professional color theory —
        monochromatic, complementary, triadic and more. Preview exactly how your
        palette looks across real UI components, in both light and dark mode.
      </p>

      {/* ── CTAs ──────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ animationDelay: "240ms" }}
      >
        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={generatePalette}
          className="h-13 px-9 text-base font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 mr-2 opacity-80" />
          Generate Palette
        </Button>

        {/* Secondary CTA */}
        <button
          onClick={() => setView("preview")}
          className="group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          See it in action
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* Keyboard hint — desktop only */}
        <div className="hidden lg:flex items-center gap-5 ml-2 text-xs text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border/70 bg-muted font-mono text-[10px] text-muted-foreground">
              SPACE
            </kbd>
            generate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border/70 bg-muted font-mono text-[10px] text-muted-foreground">
              C
            </kbd>
            copy hex
          </span>
        </div>
      </div>

      {/* ── Feature pills ─────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-700"
        style={{ animationDelay: "320ms" }}
      >
        {FEATURES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/50 text-xs font-medium text-muted-foreground bg-secondary/20 select-none"
          >
            <Icon className="w-3 h-3 text-primary opacity-80" />
            {label}
          </span>
        ))}
      </div>

      {/* ── Live Palette Strip ────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700"
        style={{ animationDelay: "420ms" }}
      >
        {/* Label */}
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 select-none">
          {hasPalette ? "Current Palette" : "Your palette will appear here"}
        </span>

        {/* Swatches */}
        <div className="flex gap-2 items-end">
          {hasPalette
            ? // Real palette swatches
              colors.map((color, i) => (
                <div
                  key={color.id}
                  className="group relative flex flex-col items-center gap-1.5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Hex tooltip on hover — desktop only */}
                  <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-foreground text-background whitespace-nowrap shadow-md">
                      {color.lightHex}
                    </span>
                  </div>

                  {/* Swatch */}
                  <div
                    className="rounded-xl border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md cursor-default"
                    style={{
                      backgroundColor: color.lightHex,
                      width: `clamp(40px, 8vw, 72px)`,
                      height: `clamp(56px, 10vw, 88px)`,
                    }}
                  />

                  {/* Role label */}
                  <span className="text-[9px] font-mono uppercase tracking-wide text-muted-foreground/50 capitalize">
                    {i === 0
                      ? "primary"
                      : i === 1
                        ? "secondary"
                        : i === 2
                          ? "accent"
                          : i === 3
                            ? "muted"
                            : i === 4
                              ? "ring"
                              : "tertiary"}
                  </span>
                </div>
              ))
            : // Placeholder shimmer swatches
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className="rounded-xl bg-secondary/60 animate-pulse border border-border/40"
                    style={{
                      width: `clamp(40px, 8vw, 72px)`,
                      height: `clamp(56px, 10vw, 88px)`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: "1.8s",
                    }}
                  />
                  <span
                    className="w-8 h-1.5 rounded-full bg-muted-foreground/15 animate-pulse"
                    style={{
                      animationDelay: `${i * 120}ms`,
                      animationDuration: "1.8s",
                    }}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
