"use client";

import { useEffect } from "react";
import { usePaletteStore } from "@/store/usePaletteStore";

export default function PalettePage() {
  const { colors, generatePalette, toggleLock } = usePaletteStore();

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

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {colors.map((color) => (
        <div
          key={color.id}
          style={{ backgroundColor: color.hex }}
          className="flex flex-1 flex-col items-center justify-center transition-colors duration-200"
        >
          <span className="text-2xl font-bold uppercase mix-blend-difference text-white">
            {color.hex}
          </span>
          <button
            onClick={() => toggleLock(color.id)}
            className="mt-4 p-2 rounded bg-white/20 hover:bg-white/30 backdrop-blur-md"
          >
            {color.isLocked ? "Locked" : "Unlock"}
          </button>
        </div>
      ))}
    </main>
  );
}
