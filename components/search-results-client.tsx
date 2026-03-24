"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Radio, Loader2 } from "lucide-react";
import { searchTantara } from "@/actions/search-tantara.action";
import { TantaraVideo } from "@/typing";
import { TantaraGrid } from "./tantara-grid";
import { TantaraCard } from "./tantara-card";

export function SearchResultsClient({
  initialVideos,
  initialToken,
  term,
}: {
  initialVideos: TantaraVideo[];
  initialToken: string | null;
  term: string;
}) {
  const [videos, setVideos] = useState<TantaraVideo[]>(initialVideos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialToken,
  );
  const [isFetching, setIsFetching] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || isFetching) return;

    setIsFetching(true);
    // Fetching from the search action we refined earlier
    const data = await searchTantara(term, nextPageToken);

    setVideos((prev) => [...prev, ...data.videos]);
    setNextPageToken(data.nextPageToken);
    setIsFetching(false);
  }, [nextPageToken, isFetching, term]);

  // Native Intersection Observer for Infinite Scroll
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

  return (
    <div className="space-y-20">
      <TantaraGrid>
        {videos.map((video, index) => (
          <TantaraCard
            key={`${video.id}-${index}`}
            video={video}
            index={index}
          />
        ))}
      </TantaraGrid>

      {/* --- INFINITE SCROLL TARGET --- */}
      <div
        ref={observerTarget}
        className="w-full flex flex-col items-center justify-center py-20 gap-4"
      >
        {isFetching && (
          <>
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
              Tuning into new frequencies...
            </p>
          </>
        )}
        {!nextPageToken && videos.length > 0 && (
          <div className="h-px w-full bg-primary/5 flex items-center justify-center relative">
            <span className="bg-background px-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary/20">
              End of Transmission
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
