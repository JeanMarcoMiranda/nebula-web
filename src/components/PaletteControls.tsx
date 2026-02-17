"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, Palette } from "lucide-react";
import { toast } from "sonner";
import { ColorStrategy } from "@/lib/paletteGenerator";

export function PaletteControls() {
  const { paletteSize, setPaletteSize, colors, strategy, setStrategy } =
    usePaletteStore();

  const handleExport = (format: "json" | "css") => {
    let content = "";
    if (format === "json") {
      content = JSON.stringify(colors, null, 2);
    } else {
      content = ":root {\n";
      colors.forEach((color, index) => {
        content += `  --color-${index + 1}-light: ${color.lightHex};\n`;
        content += `  --color-${index + 1}-dark: ${color.darkHex};\n`;
      });
      content += "}";
    }

    navigator.clipboard.writeText(content);
    toast.success(`Copied ${format.toUpperCase()} to clipboard`);
  };

  const strategyLabels: Record<ColorStrategy, string> = {
    monochromatic: "Monochromatic",
    analogous: "Analogous",
    complementary: "Complementary",
    triadic: "Triadic",
    "split-complementary": "Split Complementary",
    tetradic: "Tetradic",
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between w-full max-w-screen-xl mx-auto px-2">
      <div className="flex flex-col gap-3 w-full md:w-80">
        <div className="flex justify-between items-baseline bg-transparent">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Palette Size
          </span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {paletteSize}
          </span>
        </div>
        <Slider
          value={[paletteSize]}
          min={3}
          max={12}
          step={1}
          onValueChange={(val: number[]) => setPaletteSize(val[0])}
          className="py-2"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Strategy Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 transition-all duration-300 font-medium"
            >
              <Palette className="w-4 h-4 mr-2" />
              {strategyLabels[strategy]}
              <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[220px] rounded-xl p-2 animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Color Harmony
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(strategyLabels).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setStrategy(key as ColorStrategy)}
                className={`rounded-lg cursor-pointer ${
                  strategy === key ? "bg-accent" : ""
                }`}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-6 hover:bg-secondary/80 transition-all duration-300 font-medium text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[160px] rounded-xl p-2 animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <DropdownMenuItem
              onClick={() => handleExport("css")}
              className="rounded-lg cursor-pointer"
            >
              Copy as CSS
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("json")}
              className="rounded-lg cursor-pointer"
            >
              Copy as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
