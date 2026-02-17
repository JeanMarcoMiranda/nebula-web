"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { getContrastColor } from "@/lib/colors";
import { Copy, Lock, Unlock, RefreshCw, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { PaletteControls } from "@/components/PaletteControls";

export function ColorPalette() {
  const { colors, generatePalette, toggleLock } = usePaletteStore();
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

  const copyToClipboard = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex} to clipboard`);
  };

  if (!mounted) return null;

  const PaletteRow = ({ mode }: { mode: "light" | "dark" }) => (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl capitalize flex items-center gap-2">
          {mode === "light" ? (
            <Sun className="w-5 h-5 text-orange-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
          {mode} Variant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px] md:h-[300px] flex flex-col md:flex-row shadow-inner rounded-xl overflow-hidden ring-1 ring-border/20">
          {colors.map((color) => {
            const hex = mode === "light" ? color.lightHex : color.darkHex;
            const textColor = getContrastColor(hex);

            return (
              <div
                key={`${color.id}-${mode}`}
                className="group relative flex-1 flex flex-col items-center justify-center transition-all duration-500 ease-out hover:flex-[1.5]"
                style={{ backgroundColor: hex, color: textColor }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-2 md:gap-4 translate-y-4 group-hover:translate-y-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLock(color.id)}
                        className="rounded-full bg-black/10 hover:bg-black/20 text-inherit hover:text-inherit backdrop-blur-md transition-all transform hover:scale-110 h-10 w-10 md:h-12 md:w-12"
                      >
                        {color.isLocked ? (
                          <Lock className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Unlock className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                        <span className="sr-only">
                          {color.isLocked ? "Unlock" : "Lock"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color.isLocked ? "Unlock color" : "Lock color"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(hex)}
                        className="rounded-full bg-black/10 hover:bg-black/20 text-inherit hover:text-inherit backdrop-blur-md transition-all transform hover:scale-110 h-10 w-10 md:h-12 md:w-12"
                      >
                        <Copy className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="sr-only">Copy hex</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="absolute bottom-6 md:bottom-8 flex flex-col items-center gap-1 md:gap-2 pointer-events-none">
                  <span className="text-sm md:text-lg font-mono font-medium tracking-wider uppercase select-none">
                    {hex}
                  </span>
                  {color.isLocked && (
                    <div className="bg-black/20 backdrop-blur-sm p-1 md:p-1.5 rounded-full">
                      <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-inherit opacity-70" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-12">
      <div className="flex justify-center items-center px-4">
        <Button
          onClick={generatePalette}
          variant="default"
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Generate Palette
        </Button>
      </div>

      <PaletteControls />

      <TooltipProvider>
        <div className="flex flex-col gap-12">
          <PaletteRow mode="light" />
          <PaletteRow mode="dark" />
        </div>
      </TooltipProvider>
    </div>
  );
}
