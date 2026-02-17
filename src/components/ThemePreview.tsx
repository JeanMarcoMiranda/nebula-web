"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Bell, Mail } from "lucide-react";

export function ThemePreview() {
  return (
    <section className="w-full max-w-5xl mx-auto py-[120px] space-y-[120px]">
      {/* 
         RULE 1: The Rule of Negative Space (White Space)
         Macro-space: 120px between major sections.
      */}

      {/* Typography Section */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Typography
          </h2>
          <Separator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            {/* RULE 2: Extreme Hierarchy - Large H1 */}
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              The Art of
              <br />
              Minimalism
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
              Minimalism is the pursuit of clarity through simplicity. In this
              guide, we explore the golden rules for successfully implementing
              this style.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Visual Hierarchy
            </h2>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Focus on Content
            </h3>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Clear Navigation
            </h4>
            <p className="text-sm text-muted-foreground">
              Micro-copy and details should be subtle but legible.
            </p>
          </div>
        </div>
      </div>

      {/* Components Showcase */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Interactive Components
          </h2>
          <Separator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Card Component */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Card & Content</h3>
            {/* RULE 4: Components - Avoid heavy shadows, use soft borders */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your preferences.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Push Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Send to device.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Email Digest
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Weekly updates.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full text-white dark:text-foreground">
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Buttons & States */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Buttons & States</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Badges
                </h4>
                <div className="flex gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Forms & Inputs</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="name@example.com" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="••••••••" />
            </div>

            <div className="space-y-4 pt-4">
              <Label>Volume</Label>
              <Slider defaultValue={[33]} max={100} step={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Showing Content Switching */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Structure
          </h2>
          <Separator />
        </div>

        <Tabs defaultValue="account" className="w-full md:w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Jean Marco" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@jeanmarco" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
