import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="pt-48 pb-24 px-8 max-w-screen-xl mx-auto flex flex-col gap-8">
      <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
        Curated colors for digital artisans.
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
        Generate harmonious color palettes with a single keystroke. Designed for
        clarity, focus, and simplicity.
      </p>

      <div className="flex flex-wrap gap-4 pt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge
            variant="secondary"
            className="px-2 py-1 text-xs font-mono rounded-md"
          >
            SPACE
          </Badge>
          <span>to generate</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge
            variant="secondary"
            className="px-2 py-1 text-xs font-mono rounded-md"
          >
            CLICK
          </Badge>
          <span>to copy</span>
        </div>
      </div>
    </section>
  );
}
