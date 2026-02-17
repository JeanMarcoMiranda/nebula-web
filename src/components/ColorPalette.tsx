"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { getContrastColor } from "@/lib/colors";
import { Copy, Lock, Unlock, Sun, Moon, RefreshCw, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ColorPalette() {
  const { colors, generatePalette, toggleLock } = usePaletteStore();
  const { setTheme, theme } = useTheme();
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

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={generatePalette}
            variant="default"
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Palette
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section className="w-full h-[600px] flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/50">
        <TooltipProvider>
          {colors.map((color) => {
            const hex = theme === "dark" ? color.darkHex : color.lightHex;
            const textColor = getContrastColor(hex);

            return (
              <div
                key={color.id}
                className="group relative flex-1 flex flex-col items-center justify-center transition-all duration-500 ease-out hover:flex-[1.5]"
                style={{ backgroundColor: hex, color: textColor }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-4 translate-y-4 group-hover:translate-y-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLock(color.id)}
                        className="rounded-full bg-black/10 hover:bg-black/20 text-inherit hover:text-inherit backdrop-blur-md transition-all transform hover:scale-110 h-12 w-12"
                      >
                        {color.isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Unlock className="w-5 h-5" />
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
                        className="rounded-full bg-black/10 hover:bg-black/20 text-inherit hover:text-inherit backdrop-blur-md transition-all transform hover:scale-110 h-12 w-12"
                      >
                        <Copy className="w-5 h-5" />
                        <span className="sr-only">Copy hex</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="absolute bottom-12 flex flex-col items-center gap-2 pointer-events-none">
                  <span className="text-xl font-mono font-medium tracking-wider uppercase select-none">
                    {hex}
                  </span>
                  {color.isLocked && (
                    <div className="bg-black/20 backdrop-blur-sm p-1.5 rounded-full">
                      <Lock className="w-3 h-3 text-inherit opacity-70" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </section>
    </div>
  );
}
