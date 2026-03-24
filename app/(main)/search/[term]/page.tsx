import { searchTantara } from "@/actions/search-tantara.action";
import { SearchResultsClient } from "@/components/search-results-client";
import { Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchProps {
  params: Promise<{ term: string }>;
}

export default async function SearchPage({ params }: SearchProps) {
  const { term } = await params;
  const decodedTerm = decodeURIComponent(term);
  const initialData = await searchTantara(decodedTerm);

  return (
    <main className="min-h-screen py-28">
      {/* --- MINIMALIST HEADER --- */}
      <header className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col gap-8">
          {/* Back Action */}
          <Link href="/explore">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit -ml-3 gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5"
            >
              <ArrowLeft size={14} /> Back to Archive
            </Button>
          </Link>

          {/* Title & Stats Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Activity size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Signal Found
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-[1000] tracking-tighter leading-none uppercase">
                {decodedTerm}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-l-2 border-primary/10 pl-6 h-fit">
              <div className="flex flex-col gap-1">
                <span className="text-primary/60">Frequencies Loaded</span>
                <span className="text-foreground text-sm font-black">
                  {initialData.videos.length}+ Items
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- GRID AREA --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full bg-primary/5 mb-16" />
        <SearchResultsClient
          initialVideos={initialData.videos}
          initialToken={initialData.nextPageToken}
          term={decodedTerm}
        />
      </section>
    </main>
  );
}
