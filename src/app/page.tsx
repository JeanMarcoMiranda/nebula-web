import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ColorPalette } from "@/components/ColorPalette";
import { ThemePreview } from "@/components/ThemePreview";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background relative selection:bg-primary/20">
      <Header />

      <div className="flex flex-col gap-12 pb-32">
        <Hero />

        <div className="px-4 md:px-8">
          <ColorPalette />
          <ThemePreview />
        </div>
      </div>

      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>Designed with minimalism in mind.</p>
      </footer>
    </main>
  );
}
