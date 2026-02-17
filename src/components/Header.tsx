import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 p-8 md:p-12 flex justify-between items-center z-50 bg-background/50 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-tight select-none">
          Color Gen.
        </span>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Manifesto
        </a>
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Explore
        </a>
        <Button
          variant="outline"
          className="ml-4 rounded-full px-8 border-foreground/10 hover:bg-foreground hover:text-background transition-colors duration-500"
          asChild
        >
          <a href="#">Export</a>
        </Button>
      </nav>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] border-l-0 sm:max-w-none"
          >
            <div className="flex flex-col gap-8 mt-12 px-4">
              <a
                href="#"
                className="text-2xl font-light hover:text-primary transition-colors"
              >
                Manifesto
              </a>
              <a
                href="#"
                className="text-2xl font-light hover:text-primary transition-colors"
              >
                Explore
              </a>
              <a
                href="#"
                className="text-2xl font-light hover:text-primary transition-colors"
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
