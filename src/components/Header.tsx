import { Menu, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Palette className="w-5 h-5 text-primary" strokeWidth={2} />
        </div>
        <span className="font-bold text-lg tracking-tight select-none">
          Color Gen
        </span>
      </div>

      <nav className="hidden md:flex gap-2 text-sm font-medium items-center">
        <Button variant="ghost" asChild>
          <a href="#">Manifesto</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="#">Explore</a>
        </Button>
        <Button variant="default" className="ml-2 rounded-full px-6" asChild>
          <a href="#">Export</a>
        </Button>
      </nav>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary rounded-full"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <a
                href="#"
                className="font-medium text-lg hover:text-primary transition-colors"
              >
                Manifesto
              </a>
              <a
                href="#"
                className="font-medium text-lg hover:text-primary transition-colors"
              >
                Explore
              </a>
              <a
                href="#"
                className="font-medium text-lg hover:text-primary transition-colors"
              >
                Export
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
