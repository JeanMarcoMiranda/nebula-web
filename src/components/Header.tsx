"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Minimalist Logo - Typography based */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Color Gen.
        </Link>

        {/* Simplified Navigation & Actions */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Generate
            </Link>
            <Link
              href="/explore"
              className="hover:text-foreground transition-colors"
            >
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />

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
                    <Link
                      href="/"
                      className="text-2xl font-light hover:text-primary transition-colors"
                    >
                      Generate
                    </Link>
                    <Link
                      href="/explore"
                      className="text-2xl font-light hover:text-primary transition-colors"
                    >
                      Explore
                    </Link>
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
