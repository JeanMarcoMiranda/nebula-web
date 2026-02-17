"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { getContrastColor } from "@/lib/colors";
import { Copy, Lock, Unlock, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ColorPalette() {
  const { colors, generatePalette, toggleLock } = usePaletteStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"light" | "dark">("light");

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

  const copyToClipboard = async (hex: string, id: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="flex justify-end px-4">
        <button
          onClick={() =>
            setMode((prev) => (prev === "light" ? "dark" : "light"))
          }
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all border border-zinc-200 dark:border-zinc-700"
        >
          {mode === "light" ? (
            <>
              <Sun className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <section className="w-full h-[600px] flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden">
        {colors.map((color) => {
          const hex = mode === "light" ? color.lightHex : color.darkHex;
          const textColor = getContrastColor(hex);

          return (
            <div
              key={color.id}
              className="group relative flex-1 flex flex-col items-center justify-center transition-all duration-500 ease-out hover:flex-[1.5]"
              style={{ backgroundColor: hex, color: textColor }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-4">
                <button
                  onClick={() => toggleLock(color.id)}
                  className="p-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all transform hover:scale-110"
                  aria-label={color.isLocked ? "Unlock color" : "Lock color"}
                >
                  {color.isLocked ? (
                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Unlock className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(hex, color.id)}
                  className="p-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all transform hover:scale-110"
                  aria-label="Copy hex code"
                >
                  <Copy className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="absolute bottom-8 flex flex-col items-center gap-1">
                <span className="text-lg font-mono font-medium tracking-wider uppercase">
                  {copiedId === color.id ? "COPIED" : hex}
                </span>
                <span className="text-xs opacity-60 font-medium tracking-widest">
                  {mode.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
