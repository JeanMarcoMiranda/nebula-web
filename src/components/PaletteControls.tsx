"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function PaletteControls() {
  const { paletteSize, setPaletteSize, colors } = usePaletteStore();

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

  return (
    <div className="flex flex-col md:flex-row gap-8 items-end md:items-center justify-between w-full max-w-screen-xl mx-auto px-2">
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="flex justify-between items-center bg-transparent">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Palette Size
          </span>
          <span className="text-sm font-mono text-foreground">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 border-border/60 hover:bg-secondary/50 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2 opacity-70" />
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
