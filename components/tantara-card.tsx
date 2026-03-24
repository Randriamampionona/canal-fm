"use client";

import { Play, Radio, MoreVertical, Activity } from "lucide-react";
import { TantaraVideo } from "@/typing";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TantaraCardProps {
  video: TantaraVideo;
  index?: number;
  isLive?: boolean;
}

export function TantaraCard({ video, index, isLive }: TantaraCardProps) {
  const timeAgo = new Date(video.publishedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col w-full">
      <Link
        href={`/listening/${video.id}`}
        className="relative block aspect-video w-full overflow-hidden rounded-md bg-zinc-900 border border-white/5 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)]"
      >
        <img
          src={video.thumbnail}
          className={cn(
            "h-full w-full object-cover transition-transform duration-[15s] group-hover:scale-110",
            isLive ? "opacity-60 group-hover:opacity-100" : "opacity-100",
          )}
          alt={video.title}
          loading="lazy"
        />

        {/* LIVE BADGE OR STATUS ICON */}
        <div className="absolute top-4 left-4 z-20">
          {isLive ? (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
              <Radio size={12} className="text-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Live
              </span>
            </div>
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Activity size={14} className="text-primary animate-pulse" />
            </div>
          )}
        </div>

        {/* PLAY BUTTON OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
            <Play className="ml-1 fill-current" size={24} />
          </div>
        </div>

        {/* INDEX BADGE */}
        {typeof index === "number" && !isLive && (
          <div className="absolute right-4 top-4 z-10">
            <span className="rounded-md bg-black/50 px-2.5 py-1 text-[9px] font-black tracking-widest text-white/90 backdrop-blur-md uppercase border border-white/5">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </Link>

      <div className="mt-5 flex gap-4">
        {/* STATION ICON */}
        <div className="w-10 h-10 shrink-0 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-primary/60 transition-colors group-hover:border-primary/20 group-hover:text-primary">
          <Radio size={18} />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <Link href={`/listening/${video.id}`}>
            <h4 className="line-clamp-2 text-[15px] font-black leading-tight tracking-tight text-white/90 transition-colors group-hover:text-primary balance">
              {video.title}
            </h4>
          </Link>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                {video.channelTitle}
              </span>
              <div
                className={cn(
                  "h-1 w-1 rounded-full",
                  isLive ? "bg-red-500 animate-pulse" : "bg-white/10",
                )}
              />
            </div>

            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {isLive ? "Active Transmission" : `Decoded: ${timeAgo}`}
            </p>
          </div>
        </div>

        <button className="text-zinc-700 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 self-start">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
