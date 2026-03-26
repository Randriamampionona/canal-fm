"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavSearchProps {
  className?: string;
  placeholder?: string;
  onSearchComplete?: () => void;
}

export function NavSearch({
  className,
  placeholder,
  onSearchComplete,
}: NavSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsPending(true);

    // Trigger close immediately if provided (before navigation for better UX)
    if (onSearchComplete) onSearchComplete();

    router.push(`/search/${encodeURIComponent(query.trim())}`);

    setTimeout(() => {
      setIsPending(false);
      setQuery("");
      inputRef.current?.blur();
    }, 1000);
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative group", className)}>
      {isPending ? (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
      ) : (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      )}
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search Frequencies... (⌘K)"}
        className="w-full pl-11 h-12 md:h-11 rounded-full bg-primary/5 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:lowercase"
      />
    </form>
  );
}
