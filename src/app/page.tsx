"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ColorPalette } from "@/components/ColorPalette";
import { ThemePreview } from "@/components/ThemePreview";
import { usePaletteStore } from "@/store/usePaletteStore";
import { useEffect, useRef } from "react";

export default function Home() {
  const { view } = usePaletteStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the content section whenever the view changes
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    // Small delay so the new view has time to mount before scrolling
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(timer);
  }, [view]);

  return (
    <main className="min-h-screen w-full bg-background relative selection:bg-primary/20">
      <Header />

      <div className="flex flex-col gap-16 md:gap-[var(--spacing-macro)] pb-16 md:pb-32">
        <Hero />

        {/* Scroll target — positioned slightly above the content so the header doesn't overlap */}
        <div
          ref={contentRef}
          className="px-4 md:px-8 w-full max-w-screen-2xl mx-auto scroll-mt-24"
        >
          {view === "generator" ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <ColorPalette />
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 border rounded-xl p-6 md:p-12 bg-card/50 backdrop-blur-sm">
              <ThemePreview />
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
