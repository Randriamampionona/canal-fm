"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Flame,
  Loader2,
  ArrowUp,
  Play,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TantaraVideo } from "@/typing";
import { TantaraGrid } from "@/components/tantara-grid";
import { TantaraCard } from "@/components/tantara-card";
import { getAllTantara } from "@/actions/get-all-tantara.action";

interface ExploreClientProps {
  initialVideos: TantaraVideo[];
  initialToken: string | null;
}

const categoriesList = [
  "Sosialy",
  "Fitiavana",
  "Mampatahotra",
  "Mampitaintaina",
  "Mampiomehy",
  "Ara-panahy",
  "Tantara Polisy",
  "Tantara Mitohy",
  "Tantara Tsangana",
  "Ankizy",
  "Tantara Ara-tantara",
  "Hafatra",
  "Firenena",
  "Dahalo",
];

export function ExploreClient({
  initialVideos,
  initialToken,
}: ExploreClientProps) {
  const [videos, setVideos] = useState<TantaraVideo[]>(initialVideos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialToken,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- SCROLL LOGIC ---
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const loadMore = useCallback(async () => {
    if (!nextPageToken || isFetching) return;
    setIsFetching(true);
    const data = await getAllTantara(nextPageToken);
    setVideos((prev) => [...prev, ...data.videos]);
    setNextPageToken(data.nextPageToken);
    setIsFetching(false);
  }, [nextPageToken, isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* --- CATEGORY SECTION WITH NAV --- */}
      <div className="relative mb-12 group/nav">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
            Browse Categories
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full border-primary/10 bg-zinc-950/50 hover:bg-primary hover:text-white transition-all"
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full border-primary/10 bg-zinc-950/50 hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          <Button
            variant="default"
            className="rounded-full px-6 h-9 md:px-8 md:h-11 font-bold tracking-tight shrink-0 border-primary/10 shadow-lg shadow-primary/20"
          >
            All
          </Button>
          {categoriesList.map((tab) => (
            <Link key={tab} href={`/search/${tab.toLocaleLowerCase()}`}>
              <Button
                variant="outline"
                className="rounded-full px-6 h-9 md:px-8 md:h-11 font-bold tracking-tight shrink-0 border-white/5 bg-zinc-900/40 hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                {tab}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* --- CINEMATIC HERO --- */}
      {videos.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16 lg:mb-24">
          {/* MAIN FEATURED - Adjusted padding and text size for mobile */}
          <Link
            href={`/listening/${videos[0].id}`}
            className="flex-1 group relative aspect-4/5 md:aspect-video overflow-hidden rounded-3xl bg-secondary/20 shadow-2xl shadow-primary/5"
          >
            <img
              src={videos[0].thumbnail}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt=""
            />
            {/* Dynamic Gradient: Heavier on mobile to ensure text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex items-end justify-between gap-4">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                    Live Transmission
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-[1.1] max-w-xl line-clamp-4 md:line-clamp-3">
                  {videos[0].title}
                </h2>
              </div>

              {/* Play Button: Scaled down for mobile */}
              <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full bg-white flex items-center justify-center shadow-2xl transition-transform active:scale-90 md:group-hover:scale-110">
                <Play className="text-black fill-black ml-1" />
              </div>
            </div>
          </Link>

          {/* TRENDING SIGNALS - Horizontal on Mobile, Vertical on Desktop */}
          <div className="w-full lg:w-96 flex flex-col">
            <div className="flex items-center justify-between mb-6 lg:mb-8 border-b border-primary/10 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Trending Signals
              </h3>
              {/* Hidden on desktop, visible on mobile to show more */}
              <span className="lg:hidden text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Swipe →
              </span>
            </div>

            {/* MOBILE: Snap Scroll Container | DESKTOP: Standard Flex Column */}
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-4 lg:gap-0 lg:divide-y lg:divide-primary/5 no-scrollbar snap-x snap-mandatory">
              {videos.slice(1, 6).map((video, i) => (
                <Link
                  key={video.id}
                  href={`/listening/${video.id}`}
                  className="group/item flex flex-col lg:flex-row items-start lg:items-center gap-4 py-4 lg:first:pt-0 lg:last:pb-0 min-w-50 lg:min-w-full snap-start"
                >
                  {/* Rank Number - Hidden on Mobile for clean grid */}
                  <span className="hidden lg:block text-xs font-black text-muted-foreground/30 group-hover/item:text-primary transition-colors w-4">
                    {i + 1}
                  </span>

                  <div className="relative h-28 lg:h-12 w-full lg:w-12 shrink-0 rounded-2xl lg:rounded-md overflow-hidden bg-primary/5">
                    <img
                      src={video.thumbnail}
                      className="h-full w-full object-cover grayscale lg:grayscale group-hover/item:grayscale-0 transition-all"
                      alt=""
                    />
                    {/* Mobile Rank Badge */}
                    <div className="lg:hidden absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-black text-white">
                      #{i + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-foreground/80 leading-snug line-clamp-2 lg:line-clamp-1 group-hover/item:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest mt-1">
                      {video.channelTitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- GRID HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-[1000] tracking-tighter uppercase">
          Fresh Updates
        </h3>
        <div className="h-px flex-1 bg-primary/10 mx-8 hidden md:block" />
        <Activity size={16} className="text-primary/40 animate-pulse" />
      </div>

      <TantaraGrid>
        {videos.map((video, index) => (
          <TantaraCard
            key={`${video.id}-${index}`}
            video={video}
            index={index}
          />
        ))}
      </TantaraGrid>

      <div
        ref={observerTarget}
        className="w-full flex flex-col items-center justify-center py-24 gap-4"
      >
        {isFetching ? (
          <>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
              Syncing Signal...
            </p>
          </>
        ) : (
          !nextPageToken && (
            <div className="h-px w-full bg-primary/5 flex items-center justify-center relative">
              <span className="bg-background px-6 text-[10px] font-black uppercase tracking-[0.5em] text-primary/20">
                End of Transmission
              </span>
            </div>
          )
        )}
      </div>

      {showBackToTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 rounded-full w-14 h-14 shadow-2xl z-50 border border-primary/20"
          size="icon"
        >
          <ArrowUp size={24} />
        </Button>
      )}
    </>
  );
}
