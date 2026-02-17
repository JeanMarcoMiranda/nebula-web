"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ColorPalette } from "@/components/ColorPalette";
import { ThemePreview } from "@/components/ThemePreview";
import { ThemeScope } from "@/components/ThemeSynchronizer";
import { usePaletteStore } from "@/store/usePaletteStore";

export default function Home() {
  const { view } = usePaletteStore();

  return (
    <main className="min-h-screen w-full bg-background relative selection:bg-primary/20">
      <Header />

      <div className="flex flex-col gap-12 pb-32">
        <Hero />

        <div className="px-4 md:px-8 w-full max-w-screen-2xl mx-auto">
          {view === "generator" ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <ColorPalette />
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 border rounded-xl p-6 md:p-12 bg-card/50 backdrop-blur-sm">
              <ThemeScope>
                <ThemePreview />
              </ThemeScope>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>Designed with minimalism in mind.</p>
      </footer>
    </main>
  );
}
