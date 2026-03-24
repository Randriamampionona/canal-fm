"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function NavSearch() {
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
    // Dynamic routing to the search page
    router.push(`/search/${encodeURIComponent(query.trim())}`);

    // We reset pending after a delay so the spinner shows during the transition
    setTimeout(() => {
      setIsPending(false);
      setQuery("");
      inputRef.current?.blur();
    }, 1000);
  };

  return (
    <form onSubmit={handleSearch} className="relative group hidden xl:block">
      {isPending ? (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary animate-spin" />
      ) : (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      )}
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Frequencies... (⌘K)"
        className="w-48 pl-10 h-11 rounded-full bg-primary/5 border-none focus-visible:ring-2 focus-visible:ring-primary/10 text-xs font-medium transition-all duration-500 group-focus-within:w-64 group-focus-within:bg-primary/10 placeholder:font-normal"
      />
    </form>
  );
}
