"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePaletteStore } from "@/store/usePaletteStore";

export function Header() {
  const { view, setView } = usePaletteStore();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Minimalist Logo - Typography based */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-foreground hover:opacity-80 transition-opacity"
        >
          Color Gen.
        </Link>

        {/* Simplified Navigation & Actions */}
        <div className="flex items-center gap-12">
          {/* Desktop Nav - Rule 5: Reduce menu to strictly necessary */}
          {/* View Toggle - Generator / Preview */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50 backdrop-blur-sm">
            <button
              onClick={() => setView("generator")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                view === "generator"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setView("preview")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                view === "preview"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />

            {/* Mobile Menu - kept minimalist */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent"
                  >
                    <Menu className="w-5 h-5" strokeWidth={1.5} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-l-0">
                  <div className="flex flex-col gap-6 mt-12 px-4">
                    <button
                      onClick={() => setView("generator")}
                      className={`text-2xl font-light text-left transition-colors ${view === "generator" ? "text-primary" : "hover:text-primary"}`}
                    >
                      Generator
                    </button>
                    <button
                      onClick={() => setView("preview")}
                      className={`text-2xl font-light text-left transition-colors ${view === "preview" ? "text-primary" : "hover:text-primary"}`}
                    >
                      Preview
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
