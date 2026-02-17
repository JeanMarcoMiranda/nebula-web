export function Hero() {
  return (
    <section className="pt-48 pb-24 px-8 max-w-screen-xl mx-auto flex flex-col gap-8">
      <h1 className="max-w-4xl">Curated colors for digital artisans.</h1>
      <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
        Generate harmonious color palettes with a single keystroke. Designed for
        clarity, focus, and simplicity.
      </p>

      <div className="flex gap-4 pt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">
            SPACE
          </kbd>
          <span>to generate</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">
            CLICK
          </kbd>
          <span>to copy</span>
        </div>
      </div>
    </section>
  );
}
