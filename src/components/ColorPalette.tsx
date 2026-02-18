"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { getContrastColor } from "@/lib/colors";
import { Copy, Lock, Unlock, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { PaletteControls } from "@/components/PaletteControls";

export function ColorPalette() {
  const { generatePalette } = usePaletteStore();
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
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-[var(--spacing-section)]">
      <PaletteControls />

      <div className="flex flex-col gap-[var(--spacing-section)]">
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

          return (
            <div
              key={`${color.id}-${mode}`}
              className="relative flex-1 h-[160px] md:h-[320px] flex flex-col items-center justify-center transition-all duration-500 ease-out hover:flex-[1.5] group"
              style={{ backgroundColor: hex, color: textColor }}
            >
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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

              <span className="absolute bottom-4 md:bottom-8 font-mono text-xs md:text-sm tracking-wider opacity-90 select-none uppercase">
                {hex}
              </span>

              {color.isLocked && (
                <div className="absolute top-4 right-4 md:hidden">
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
