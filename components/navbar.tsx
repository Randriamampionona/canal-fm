"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Compass,
  Mic2,
  Sun,
  Moon,
  ArrowRight,
  ListMusic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavSearch } from "./nav-search";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
// Import Shadcn Dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/broadcast", label: "Broadcast", icon: Mic2, isLive: true },
    { href: "/channels", label: "Channels", icon: Radio },
  ];

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-primary/10 bg-background/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* 1. BRANDING */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Radio
              className="text-primary-foreground"
              size={22}
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-black tracking-tighter leading-none">
              CANAL FM
            </h1>
            <p className="text-[8px] text-primary font-black uppercase tracking-[0.25em] mt-1">
              Iarivo Frequency
            </p>
          </div>
        </Link>

        {/* 2. CENTER NAVIGATION */}
        <div className="hidden md:flex items-center bg-primary/3 p-1.5 rounded-full border border-primary/5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`
          relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300
          ${isActive ? "bg-background text-primary shadow-[0_2px_10px_rgba(0,0,0,0.08)]" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}
        `}
                >
                  <link.icon size={15} strokeWidth={isActive ? 3 : 2} />
                  {link.label}
                  {link.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* PRO "PLUS" DROPDOWN FOR MEMBERS */}
          <Show when="signed-in">
            <div className="flex items-center">
              {/* Subtle Vertical Divider */}
              <div className="h-4 w-px bg-primary/10 mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group relative rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
                  >
                    Plus
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-52 rounded-2xl border-primary/10 bg-background/95 backdrop-blur-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-primary/5 animate-in fade-in zoom-in-95 duration-200"
                >
                  <DropdownMenuLabel className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    Member Access
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />

                  <Link href="/playlists">
                    <DropdownMenuItem className="group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ListMusic size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          My Playlist
                        </span>
                      </div>
                      <ArrowRight
                        size={12}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Show>
        </div>

        {/* 3. SEARCH & ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          <NavSearch />
          <div className="h-8 w-px bg-primary/10 mx-1 hidden sm:block" />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-full h-11 w-11 hover:bg-primary/5 text-muted-foreground transition-all active:scale-90 group overflow-hidden flex items-center justify-center"
            >
              {mounted && (
                <div className="relative h-5 w-5 flex items-center justify-center">
                  <Sun
                    size={19}
                    className={`absolute transition-all duration-500 transform ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
                  />
                  <Moon
                    size={19}
                    className={`absolute transition-all duration-500 transform ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"} text-primary`}
                  />
                </div>
              )}
            </Button>

            <Show when="signed-out">
              <Link href="/sign-in">
                <Button className="rounded-full h-11 px-6 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex gap-2 group">
                  Join Terminal
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9",
                    userButtonTrigger: "focus:shadow-none focus:ring-0",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
