"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { getContrastColor } from "@/lib/colors";
import { Copy, Lock, Unlock, Sun, Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PaletteControls } from "@/components/PaletteControls";
import { ROLE_META, ColorRole } from "@/lib/paletteGenerator";

export function ColorPalette() {
  const { generatePalette, schemeName } = usePaletteStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        generatePalette();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [generatePalette]);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-10 md:gap-[var(--spacing-section)]">
      <PaletteControls />

      <div className="flex flex-col gap-10 md:gap-[var(--spacing-section)]">
        {/* Scheme label */}
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-3.5 h-3.5 text-primary opacity-70" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {schemeName} · Press{" "}
            <kbd className="px-1 py-0.5 rounded border border-border text-[10px]">
              Space
            </kbd>{" "}
            to regenerate
          </span>
        </div>

        <PaletteStrip mode="light" />
        <PaletteStrip mode="dark" />
      </div>
    </div>
  );
}

function PaletteStrip({ mode }: { mode: "light" | "dark" }) {
  const { colors, toggleLock } = usePaletteStore();

  const copyToClipboard = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex} to clipboard`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2 opacity-50 hover:opacity-100 transition-opacity">
        {mode === "light" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
        <span className="text-sm font-medium uppercase tracking-widest">
          {mode} Variant
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden ring-1 ring-border/20 shadow-sm">
        {colors.map((color) => {
          const hex = mode === "light" ? color.lightHex : color.darkHex;
          const textColor = getContrastColor(hex);
          const role = color.role as ColorRole | undefined;
          const roleMeta = role ? ROLE_META[role] : null;

          return (
            <div
              key={`${color.id}-${mode}`}
              className="relative flex-1 h-24 md:h-[200px] lg:h-[340px] flex flex-col md:justify-between transition-all duration-500 ease-out md:hover:flex-[1.6] group"
              style={{ backgroundColor: hex, color: textColor }}
            >
              {/* Top: role label */}
              <div className="px-3 md:px-4 pt-3 md:pt-5 flex flex-col gap-1">
                <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60 select-none">
                  {roleMeta?.label ?? role ?? ""}
                </span>
                {/* Role description — appears on hover, desktop only */}
                {roleMeta && (
                  <p className="text-xs leading-snug opacity-0 group-hover:opacity-80 transition-all duration-300 translate-y-1 group-hover:translate-y-0 max-w-[120px] line-clamp-3 hidden md:block">
                    {roleMeta.description}
                  </p>
                )}
              </div>

              {/* Center: action buttons */}
              <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLock(color.id)}
                  className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-inherit hover:text-inherit backdrop-blur-xl transition-all duration-200"
                >
                  {color.isLocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Unlock className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(hex)}
                  className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-inherit hover:text-inherit backdrop-blur-xl transition-all duration-200"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              {/* Bottom: hex value */}
              <div className="px-3 md:px-4 pb-3 md:pb-5 flex items-end justify-between">
                <span className="font-mono text-[10px] md:text-sm tracking-wider opacity-90 select-none uppercase">
                  {hex}
                </span>
                {color.isLocked && <Lock className="w-3 h-3 opacity-50" />}
              </div>

              {/* Lock indicator top-right (desktop) */}
              {color.isLocked && (
                <div className="absolute top-4 right-4 hidden md:block">
                  <Lock className="w-3 h-3 opacity-50" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
