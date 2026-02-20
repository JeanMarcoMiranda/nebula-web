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
import { ArrowRight, Moon, Sun, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ThemeScope } from "@/components/ThemeSynchronizer";
import { COLOR_ROLES, ROLE_META, ColorRole } from "@/lib/paletteGenerator";
import { useState } from "react";

export function ThemePreview() {
  const {
    colors,
    schemeName,
    schemeDescription,
    schemeMood,
    schemeUseCases,
    schemeTags,
  } = usePaletteStore();
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const isDark = previewTheme === "dark";

  return (
    <div className="w-full flex flex-col gap-[var(--spacing-section)]">
      {/*
        ThemeScope is a real `div` that carries BOTH:
        - the `.dark` class (so Tailwind dark: variants activate)
        - all palette CSS custom properties via `style` (so shadcn reads them)
        These MUST be on the same element for CSS cascade to work correctly.
      */}
      <ThemeScope
        forcedTheme={previewTheme}
        className="relative rounded-3xl overflow-hidden border transition-all duration-500"
      >
        {/*
          No extra `.dark` class here — ThemeScope already handles it.
          We only use inline styles for things that aren't CSS-var-based.
        */}
        <div
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            boxShadow: isDark
              ? "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px -16px rgba(0,0,0,0.6)"
              : "0 0 0 1px rgba(0,0,0,0.05), 0 32px 64px -16px rgba(0,0,0,0.12)",
          }}
        >
          {/* ── Frame Header / Controls ──────────────────────────────── */}
          <div
            className="flex items-center justify-between px-8 py-4 border-b"
            style={{
              borderColor: "var(--border)",
              backgroundColor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            }}
          >
            {/* Browser chrome dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>

            {/* URL bar hint */}
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--muted-foreground)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
              />
              yourapp.com
            </div>

            {/* Light / Dark toggle */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                Preview
              </span>
              <button
                onClick={() => setPreviewTheme(isDark ? "light" : "dark")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--foreground)",
                }}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Preview Content ───────────────────────────────────────── */}
          <div className="w-full flex flex-col gap-[var(--spacing-macro)] px-8 md:px-16 py-16 md:py-20">
            {/* ══ PALETTE INFO PANEL ══════════════════════════════════════ */}
            <section
              className="rounded-2xl border p-6 md:p-8 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700"
              style={{
                borderColor: "var(--border)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.015)",
              }}
            >
              {/* Label row */}
              <div className="flex items-center gap-2">
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--primary)" }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--primary)" }}
                >
                  Active Palette
                </span>
              </div>

              {/* Name + Description */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                <div className="flex flex-col gap-2 flex-1">
                  <h3
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {schemeName}
                  </h3>
                  <p
                    className="text-sm leading-relaxed max-w-2xl"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {schemeDescription}
                  </p>
                </div>
                {/* Mood */}
                <div
                  className="flex flex-col gap-1 shrink-0"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                    Mood
                  </span>
                  <span className="text-sm font-medium">{schemeMood}</span>
                </div>
              </div>

              {/* Tags + Use Cases */}
              <div className="flex flex-wrap gap-2">
                {schemeTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                    style={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className="h-5 w-px mx-1 self-center"
                  style={{ backgroundColor: "var(--border)" }}
                />
                {schemeUseCases.map((uc) => (
                  <span
                    key={uc}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </section>

            {/* SECTION 1: TYPOGRAPHY */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <SectionHeader number="01" title="Typography" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-baseline">
                <div className="space-y-6">
                  <h1
                    className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85]"
                    style={{ color: "var(--foreground)" }}
                  >
                    Visual
                    <br />
                    Clarity.
                  </h1>
                  <p
                    className="text-xl font-light max-w-md leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Typography is the voice of your design. Use it to create
                    hierarchy and guide the user&apos;s eye through the content.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      label: "Headline 2",
                      cls: "text-4xl font-bold tracking-tight",
                    },
                    {
                      label: "Headline 3",
                      cls: "text-2xl font-semibold tracking-tight",
                    },
                    { label: "Body", cls: "text-base leading-relaxed" },
                  ].map(({ label, cls }) => (
                    <div key={label} className="space-y-2">
                      <span
                        className="text-xs font-mono uppercase tracking-widest"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {label}
                      </span>
                      <p className={cls} style={{ color: "var(--foreground)" }}>
                        {label === "Body"
                          ? "Minimalism is not about removing things you love. It\u2019s about removing the things that distract you from the things you love."
                          : label === "Headline 2"
                            ? "The quick brown fox"
                            : "Jumps over the lazy dog"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: PALETTE */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <SectionHeader number="02" title="Palette" />

              {/* Color band */}
              <div
                className="grid h-32 md:h-44 rounded-2xl overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))`,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {colors.map((color, i) => (
                  <div
                    key={color.id}
                    className="h-full flex flex-col items-center justify-end pb-5 relative group"
                    style={{
                      backgroundColor: `var(--${COLOR_ROLES[i]})`,
                    }}
                  >
                    {/* Hex label on hover */}
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(0,0,0,0.75)"
                          : "rgba(255,255,255,0.85)",
                        color: isDark ? "#fafafa" : "#09090b",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {isDark ? color.darkHex : color.lightHex}
                    </div>
                  </div>
                ))}
              </div>

              {/* Role labels row */}
              <div
                className="flex justify-between text-xs font-mono uppercase tracking-wider px-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                {colors.map((_, i) => (
                  <span key={i} className="capitalize">
                    {COLOR_ROLES[i]}
                  </span>
                ))}
              </div>

              {/* ── Role detail cards ──────────────────────────────────── */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(colors.length, 3)}, minmax(0, 1fr))`,
                }}
              >
                {colors.map((color, i) => {
                  const role = COLOR_ROLES[i] as ColorRole;
                  const meta = ROLE_META[role];
                  const hex = isDark ? color.darkHex : color.lightHex;

                  return (
                    <div
                      key={color.id}
                      className="rounded-xl p-5 flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.01]"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--secondary)",
                      }}
                    >
                      {/* Color swatch + hex */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg shrink-0"
                          style={{
                            backgroundColor: hex,
                            outline: "1px solid var(--border)",
                          }}
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--foreground)" }}
                          >
                            {meta.label}
                          </span>
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {hex}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {meta.description}
                      </p>

                      {/* UI uses */}
                      <div className="flex flex-wrap gap-1">
                        {meta.uiUses.slice(0, 3).map((use) => (
                          <span
                            key={use}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: hex + "22",
                              color: "var(--foreground)",
                            }}
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3: INTERFACE */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <SectionHeader number="03" title="Interface" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                {/* Column 1: Actions & Inputs */}
                <div className="space-y-12">
                  {/* Buttons */}
                  <div className="space-y-6">
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted-foreground)" }}
                    >
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
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Inputs
                    </h4>
                    <div className="grid gap-6 max-w-sm">
                      <div className="grid gap-2">
                        <Label htmlFor="preview-email">Email Address</Label>
                        <Input
                          id="preview-email"
                          placeholder="name@example.com"
                          className="bg-transparent"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Volume Control</Label>
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                      <div
                        className="flex items-center space-x-4 border p-4 rounded-xl"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex-1 space-y-1">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--foreground)" }}
                          >
                            Dark Mode
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Switch appearance
                          </p>
                        </div>
                        <Switch
                          checked={isDark}
                          onCheckedChange={(c) =>
                            setPreviewTheme(c ? "dark" : "light")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Card */}
                <div className="space-y-12">
                  <h4
                    className="text-sm font-medium uppercase tracking-widest"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Composition
                  </h4>

                  <Card
                    className="shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="font-mono font-normal"
                        >
                          NEW
                        </Badge>
                        <span
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
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
                      <div
                        className="h-32 rounded-lg flex items-center justify-center border border-dashed"
                        style={{
                          backgroundColor: "var(--secondary)",
                          borderColor: "var(--border)",
                          opacity: 0.5,
                        }}
                      >
                        <div
                          className="h-8 w-8 rounded-full animate-pulse"
                          style={{
                            backgroundColor: "var(--primary)",
                            opacity: 0.4,
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: "var(--muted-foreground)" }}>
                            Progress
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "var(--foreground)" }}
                          >
                            75%
                          </span>
                        </div>
                        <div
                          className="h-1 w-full rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--secondary)" }}
                        >
                          <div
                            className="h-full w-3/4 rounded-full"
                            style={{ backgroundColor: "var(--primary)" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter
                      className="border-t pt-6"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Button className="w-full group" variant="default">
                        Continue{" "}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Badges & misc */}
                  <div className="space-y-4">
                    <h4
                      className="text-sm font-medium uppercase tracking-widest"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Badges
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>

                  {/* Separator demo */}
                  <div className="space-y-4">
                    <Separator style={{ backgroundColor: "var(--border)" }} />
                    <p
                      className="text-sm text-center"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Separator at full width
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </ThemeScope>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-sm" style={{ color: "var(--primary)" }}>
        {number}
      </span>
      <h2
        className="text-sm font-medium tracking-[0.2em] uppercase"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: "var(--border)" }}
      />
    </div>
  );
}
