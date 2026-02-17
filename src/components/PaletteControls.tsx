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
import { Download, SlidersHorizontal } from "lucide-react";
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
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-muted/30 rounded-lg items-center justify-between w-full">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <span className="text-sm font-medium whitespace-nowrap">
          Palette Size: {paletteSize}
        </span>
        <Slider
          value={[paletteSize]}
          min={3}
          max={12}
          step={1}
          onValueChange={(val: number[]) => setPaletteSize(val[0])}
          className="w-full md:w-[200px]"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("css")}>
              Copy as CSS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              Copy as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
