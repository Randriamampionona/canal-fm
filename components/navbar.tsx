"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Compass, Bell, User, Mic2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavSearch } from "./nav-search";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/broadcast", label: "Broadcast", icon: Mic2, isLive: true },
    { href: "/channels", label: "Channels", icon: Radio },
  ];

  // Prevent hydration mismatch by only rendering after mount
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
            {/* Subtle glow effect behind logo */}
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

        {/* 2. CENTER NAVIGATION - MODERN SEGMENTED CONTROL */}
        <div className="hidden md:flex items-center bg-primary/3 p-1.5 rounded-full border border-primary/5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`
                  relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300
                  ${
                    isActive
                      ? "bg-background text-primary shadow-[0_2px_10px_rgba(0,0,0,0.08)] scale-100"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5 scale-95 hover:scale-100"
                  }
                `}
                >
                  <link.icon size={15} strokeWidth={isActive ? 3 : 2} />
                  {link.label}

                  {/* Creative "Live" Indicator for Broadcast */}
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
        </div>

        {/* 3. SEARCH & ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          <NavSearch />

          <div className="h-8 w-px bg-primary/10 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5">
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
                    className={`absolute transition-all duration-500 transform ${
                      theme === "dark"
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    }`}
                  />
                  <Moon
                    size={19}
                    className={`absolute transition-all duration-500 transform ${
                      theme === "dark"
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                    } text-primary`}
                  />
                </div>
              )}

              {/* Subtle hover glow for the switch */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            </Button>

            <Button
              size="icon"
              className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-90"
            >
              <User size={19} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
