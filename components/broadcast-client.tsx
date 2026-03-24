"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, Activity } from "lucide-react";
import { TantaraVideo } from "@/typing";
import { TantaraGrid } from "@/components/tantara-grid";
import { TantaraCard } from "@/components/tantara-card";
import { getLiveBroadcasts } from "@/actions/get-broadcasts.action";

interface BroadcastClientProps {
  initialVideos: TantaraVideo[];
  initialToken: string | null;
}

export function BroadcastClient({
  initialVideos,
  initialToken,
}: BroadcastClientProps) {
  const [videos, setVideos] = useState<TantaraVideo[]>(initialVideos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialToken,
  );
  const [isFetching, setIsFetching] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || isFetching) return;
    setIsFetching(true);

    const data = await getLiveBroadcasts(nextPageToken);

    // Filter out duplicates just in case YouTube API returns overlapping items
    setVideos((prev) => {
      const newVideos = data.videos.filter(
        (nv) => !prev.some((pv) => pv.id === nv.id),
      );
      return [...prev, ...newVideos];
    });

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

  if (videos.length === 0 && !isFetching) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-600 font-black uppercase tracking-[0.5em] animate-pulse">
          No active signals found in this band...
        </p>
      </div>
    );
  }

  return (
    <>
      <TantaraGrid>
        {videos.map((video, index) => (
          <TantaraCard
            key={`${video.id}-${index}`}
            video={video}
            index={index}
            isLive={true}
          />
        ))}
      </TantaraGrid>

      {/* INFINITE SCROLL TARGET */}
      <div
        ref={observerTarget}
        className="w-full flex flex-col items-center justify-center py-24 gap-4"
      >
        {isFetching ? (
          <>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
              Scanning frequencies...
            </p>
          </>
        ) : (
          nextPageToken && <div className="h-px w-full bg-white/5" />
        )}
      </div>
    </>
  );
}
