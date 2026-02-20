"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePaletteStore } from "@/store/usePaletteStore";
import { useState } from "react";

export function Header() {
  const { view, setView } = usePaletteStore();
  // Controls Sheet open state so we can close it after navigation
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMobileNav = (v: "generator" | "preview") => {
    setView(v);
    setSheetOpen(false); // close the sheet immediately
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-foreground hover:opacity-80 transition-opacity"
        >
          Nebula.
        </Link>

        {/* Nav & Actions */}
        <div className="flex items-center gap-4 md:gap-12">
          {/* Desktop toggle pill */}
          <div className="hidden md:flex items-center gap-0.5 bg-secondary/30 p-0.5 rounded-full border border-border/30 backdrop-blur-sm">
            <button
              onClick={() => setView("generator")}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                view === "generator"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setView("preview")}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
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

            {/* Mobile sheet menu */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                      onClick={() => handleMobileNav("generator")}
                      className={`text-2xl font-light text-left transition-colors ${
                        view === "generator"
                          ? "text-primary"
                          : "hover:text-primary"
                      }`}
                    >
                      Generator
                    </button>
                    <button
                      onClick={() => handleMobileNav("preview")}
                      className={`text-2xl font-light text-left transition-colors ${
                        view === "preview"
                          ? "text-primary"
                          : "hover:text-primary"
                      }`}
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
