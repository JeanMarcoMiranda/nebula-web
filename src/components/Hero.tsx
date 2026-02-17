import { Badge } from "@/components/ui/badge";
import { Command } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-[var(--spacing-macro)] pb-[var(--spacing-section)] px-8 max-w-screen-xl mx-auto flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="max-w-5xl text-6xl md:text-8xl font-bold tracking-tighter text-foreground leading-[1.1]">
        Curated colors for <br className="hidden md:block" /> digital artisans.
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
        Generate harmonious color palettes with a single keystroke. Designed for
        clarity, focus, and simplicity.
      </p>

      <div className="flex flex-wrap gap-8 pt-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs font-mono rounded-md border-border/50 bg-secondary/50"
          >
            SPACE
          </Badge>
          <span className="font-light">to generate</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs font-mono rounded-md border-border/50 bg-secondary/50"
          >
            CLICK
          </Badge>
          <span className="font-light">to copy</span>
        </div>
      </div>
    </section>
  );
}
