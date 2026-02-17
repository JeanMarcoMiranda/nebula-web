"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";
import { usePaletteStore } from "@/store/usePaletteStore";

export function Hero() {
  const { generatePalette } = usePaletteStore();

  return (
    <section className="pt-[var(--spacing-macro)] pb-[var(--spacing-section)] px-8 max-w-screen-xl mx-auto flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="max-w-5xl text-6xl md:text-8xl font-bold tracking-tighter text-foreground leading-[1.1]">
        Curated colors for <br className="hidden md:block" /> digital artisans.
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
        Generate harmonious color palettes with a single keystroke. Designed for
        clarity, focus, and simplicity.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
        <Button
          size="lg"
          onClick={generatePalette}
          className="h-12 px-8 text-base font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Generate Palette
        </Button>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground/60">
          <span className="flex items-center gap-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              SPACE
            </kbd>
            to generate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              C
            </kbd>
            to copy
          </span>
        </div>
      </div>
    </section>
  );
}
