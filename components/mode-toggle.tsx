"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-33 h-12" />;

  const modes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Monitor },
  ] as const;

  const activeIndex = modes.findIndex((m) => m.name === theme);

  return (
    <div className="relative flex items-center p-1 bg-primary/5 backdrop-blur-3xl border border-primary/10 rounded-full shadow-2xl w-fit">
      <div
        className="absolute h-10 w-10 bg-primary rounded-full shadow-lg shadow-primary/40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          left: `calc(${activeIndex * 40}px + 4px)`,
        }}
      />

      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = theme === mode.name;

        return (
          <Button
            key={mode.name}
            variant="ghost"
            size="icon"
            onClick={() => setTheme(mode.name)}
            className={cn(
              "relative z-10 w-10 h-10 rounded-full transition-colors duration-500",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-transparent",
            )}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 3 : 2}
              className="transition-transform duration-500"
            />
            <span className="sr-only">{mode.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
