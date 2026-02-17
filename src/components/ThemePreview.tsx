"use client";

import { usePaletteStore } from "@/store/usePaletteStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { ThemeScope } from "@/components/ThemeSynchronizer";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemePreview() {
  const { colors } = usePaletteStore();
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  return (
    <div className="w-full flex flex-col gap-[var(--spacing-section)]">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => setPreviewTheme("light")}
            className={`px-5 py-2 font-medium transition-all duration-300 ${
              previewTheme === "light"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Light
          </button>
          <span className="text-muted-foreground/30">/</span>
          <button
            onClick={() => setPreviewTheme("dark")}
            className={`px-5 py-2 font-medium transition-all duration-300 ${
              previewTheme === "dark"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <ThemeScope forcedTheme={previewTheme}>
        <div className="w-full flex flex-col gap-[var(--spacing-macro)]">
          {/* SECTION 1: TYPOGRAPHY (The Content) */}
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionHeader number="01" title="Typography" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-baseline">
              {/* H1 - Extreme Hierarchy */}
              <div className="space-y-6">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85]">
                  Visual
                  <br />
                  Clarity.
                </h1>
                <p className="text-xl text-muted-foreground font-light max-w-md leading-relaxed">
                  Typography is the voice of your design. Use it to create
                  hierarchy and guide the user's eye through the content.
                </p>
              </div>

              {/* Scale */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                    Headline 2
                  </span>
                  <h2 className="text-4xl font-bold tracking-tight">
                    The quick brown fox
                  </h2>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                    Headline 3
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Jumps over the lazy dog
                  </h3>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                    Body
                  </span>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Minimalism is not about removing things you love. It&apos;s
                    about removing the things that distract you from the things
                    you love.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PALETTE (The Foundation) */}
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <SectionHeader number="02" title="Palette" />

            <div className="grid grid-cols-5 h-32 md:h-48 rounded-2xl overflow-hidden ring-1 ring-border/50">
              {colors.slice(0, 5).map((color, i) => (
                <div
                  key={color.id}
                  className="h-full flex flex-col items-center justify-end pb-6 relative group"
                  style={{ backgroundColor: `var(--${getColorName(i)})` }}
                >
                  <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm">
                    {previewTheme === "light" ? color.lightHex : color.darkHex}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono uppercase tracking-wider px-1">
              <span>Primary</span>
              <span>Secondary</span>
              <span>Accent</span>
              <span>Muted</span>
              <span>Ring</span>
            </div>
          </section>

          {/* SECTION 3: INTERFACE (The Components) */}
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <SectionHeader number="03" title="Interface" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
              {/* Column 1: Actions & Inputs */}
              <div className="space-y-12">
                {/* Buttons */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Actions
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="rounded-full px-8">
                      Primary Action
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      Secondary
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      Outline
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      Ghost
                    </Button>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Inputs
                  </h4>
                  <div className="grid gap-6 max-w-sm">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        className="bg-transparent"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Volume Control</Label>
                      <Slider defaultValue={[75]} max={100} step={1} />
                    </div>
                    <div className="flex items-center space-x-4 border p-4 rounded-xl">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-xs text-muted-foreground">
                          Switch appearance
                        </p>
                      </div>
                      <Switch
                        checked={previewTheme === "dark"}
                        onCheckedChange={(c) =>
                          setPreviewTheme(c ? "dark" : "light")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Cards & Composition */}
              <div className="space-y-12">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Composition
                </h4>

                <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="font-mono font-normal"
                      >
                        NEW
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Just now
                      </span>
                    </div>
                    <CardTitle className="text-2xl mt-2">
                      Minimalist Card
                    </CardTitle>
                    <CardDescription>
                      Cards should be used to group related information. Keep
                      distinct boundaries but avoid heavy shadows.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-32 bg-secondary/30 rounded-lg flex items-center justify-center border border-dashed border-border">
                      <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/50 pt-6">
                    <Button className="w-full group" variant="default">
                      Continue{" "}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </ThemeScope>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-sm text-primary">{number}</span>
      <h2 className="text-sm font-medium tracking-[0.2em] text-foreground uppercase">
        {title}
      </h2>
      <Separator className="flex-1 bg-border/50" />
    </div>
  );
}

function getColorName(index: number) {
  const names = ["primary", "secondary", "accent", "muted", "ring"];
  return names[index] || "primary";
}
