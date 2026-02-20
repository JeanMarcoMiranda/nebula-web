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
import { Download, ChevronDown, Palette, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ColorStrategy, STRATEGY_META } from "@/lib/paletteGenerator";

export function PaletteControls() {
  const {
    paletteSize,
    setPaletteSize,
    colors,
    strategy,
    setStrategy,
    schemeName,
    schemeDescription,
    schemeMood,
    schemeUseCases,
    schemeTags,
  } = usePaletteStore();

  const handleExport = (format: "json" | "css") => {
    let content = "";
    if (format === "json") {
      content = JSON.stringify(colors, null, 2);
    } else {
      // Light theme vars
      content = "/* Light Mode */\n:root {\n";
      colors.forEach((color) => {
        content += `  --${color.role}: ${color.lightHex};\n`;
      });
      content += "}\n\n";
      // Dark theme vars
      content += "/* Dark Mode */\n.dark {\n";
      colors.forEach((color) => {
        content += `  --${color.role}: ${color.darkHex};\n`;
      });
      content += "}";
    }

    navigator.clipboard.writeText(content);
    toast.success(`Copied ${format.toUpperCase()} to clipboard`);
  };

  const currentMeta = STRATEGY_META[strategy];

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-xl mx-auto px-2">
      {/* ── Row 1: Slider + Selectors ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between w-full">
        {/* Palette Size Slider */}
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
            max={6}
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
                {currentMeta.label}
                <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] rounded-xl p-2 animate-in fade-in-0 zoom-in-95 duration-200"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                Color Harmony
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(STRATEGY_META) as ColorStrategy[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setStrategy(key)}
                  className={`rounded-lg cursor-pointer flex flex-col items-start gap-0.5 py-2.5 ${
                    strategy === key ? "bg-accent" : ""
                  }`}
                >
                  <span className="font-medium text-sm">
                    {STRATEGY_META[key].label}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {STRATEGY_META[key].mood}
                  </span>
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

      {/* ── Row 2: Strategy Info Card ─────────────────────────────── */}
      <div
        className="w-full rounded-2xl border px-6 py-5 flex flex-col gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
        key={strategy}
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--secondary)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                {schemeName} Palette
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {schemeDescription}
            </p>
          </div>
          {/* Mood */}
          <span className="shrink-0 text-xs font-mono text-muted-foreground whitespace-nowrap hidden md:block">
            {schemeMood}
          </span>
        </div>

        {/* Tags + use-cases */}
        <div className="flex flex-wrap gap-2">
          {schemeTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
              }}
            >
              {tag}
            </span>
          ))}
          <span
            className="h-5 w-px mx-1 self-center"
            style={{ backgroundColor: "var(--border)" }}
          />
          {schemeUseCases.map((uc) => (
            <span
              key={uc}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "var(--muted, hsl(0,0%,94%))",
                color: "var(--muted-foreground)",
              }}
            >
              {uc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
