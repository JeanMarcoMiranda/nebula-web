import { Menu, Palette } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Palette className="w-6 h-6" strokeWidth={1.5} />
        <span className="font-bold text-lg tracking-tight">Color Gen</span>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">
          Manifesto
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Explore
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Export
        </a>
      </nav>

      <button className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors">
        <Menu className="w-6 h-6" strokeWidth={1.5} />
      </button>
    </header>
  );
}
