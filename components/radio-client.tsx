"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, ArrowUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TantaraVideo } from "@/typing";
import { TantaraGrid } from "@/components/tantara-grid";
import { TantaraCard } from "@/components/tantara-card";
import { getRadioTantara } from "@/actions/get-radio-tantara.action";

interface RadioClientProps {
  initialVideos: TantaraVideo[];
  initialToken: string | null;
  channelName: string;
}

export function RadioClient({
  initialVideos,
  initialToken,
  channelName,
}: RadioClientProps) {
  const [videos, setVideos] = useState<TantaraVideo[]>(initialVideos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialToken,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || isFetching) return;
    setIsFetching(true);
    const data = await getRadioTantara(channelName, nextPageToken);
    setVideos((prev) => [...prev, ...data.videos]);
    setNextPageToken(data.nextPageToken);
    setIsFetching(false);
  }, [nextPageToken, isFetching, channelName]);

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
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-2xl font-[1000] tracking-tighter uppercase text-white">
          Signal Archive
        </h3>
        <div className="h-px flex-1 bg-white/5 mx-8" />
        <Activity size={16} className="text-primary animate-pulse" />
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
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">
              Fetching more signals...
            </p>
          </>
        ) : (
          !nextPageToken && (
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
              Frequency End Reached
            </p>
          )
        )}
      </div>

      {showBackToTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 rounded-full w-14 h-14 shadow-2xl z-50 bg-primary hover:scale-110 transition-transform"
          size="icon"
        >
          <ArrowUp size={24} className="text-white" />
        </Button>
      )}
    </>
  );
}
