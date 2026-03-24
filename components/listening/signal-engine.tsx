"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function SignalEngine({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: id,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: any) => {
            setDuration(e.target.getDuration());
            e.target.setVolume(volume);
            setIsReady(true);
            setPlaying(true);
          },
          onStateChange: (e: any) => setPlaying(e.data === 1),
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        if (total > 0) setPlayed(current / total);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [id]);

  const togglePlay = () => {
    if (!isReady) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  return (
    <div className="mt-16 relative w-full max-w-5xl mx-auto">
      <div id="youtube-player" className="hidden" />

      {/* THE DECK */}
      <div className="relative overflow-hidden bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-md p-8 lg:p-12 shadow-2xl">
        {/* WAVEFORM VISUALIZER */}
        <div className="h-24 w-full flex items-end justify-center gap-0.75 mb-12 group">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-500 ${playing ? "bg-primary/60" : "bg-zinc-800 h-1"}`}
              style={{
                height: playing
                  ? `${Math.max(10, Math.random() * 100)}%`
                  : "4px",
                transitionDelay: `${i * 10}ms`,
              }}
            />
          ))}
        </div>

        <div className="space-y-10">
          {/* SCRUBBER */}
          <div className="group/slider relative">
            <Slider
              value={[played]}
              max={1}
              step={0.0001}
              onValueChange={(v) =>
                playerRef.current?.seekTo(v[0] * duration, true)
              }
              className="cursor-pointer"
            />
            <div className="flex justify-between mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              <span className={playing ? "text-primary animate-pulse" : ""}>
                {Math.floor((played * duration) / 60)}:
                {Math.floor((played * duration) % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2 opacity-50">
                <Zap size={10} />
                <span>Solo Frequency</span>
              </div>
              <span>
                {Math.floor(duration / 60)}:
                {Math.floor(duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* MAIN CONTROLS */}
          <div className="flex items-center justify-between gap-8">
            {/* VOLUME HUB */}
            <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/5 w-48">
              <button
                onClick={() => {
                  const n = !muted;
                  setMuted(n);
                  playerRef.current?.setVolume(n ? 0 : volume);
                }}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {muted || volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <Slider
                value={[muted ? 0 : volume]}
                max={100}
                onValueChange={(v) => {
                  setVolume(v[0]);
                  playerRef.current?.setVolume(v[0]);
                }}
              />
            </div>

            {/* THE COMMAND BUTTON */}
            <Button
              onClick={togglePlay}
              disabled={!isReady}
              className="h-24 w-24 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl active:scale-90 disabled:opacity-50 group"
            >
              {playing ? (
                <Pause size={36} fill="currentColor" />
              ) : (
                <Play size={36} fill="currentColor" className="ml-1" />
              )}
            </Button>

            {/* PLACEHOLDER FOR SYMMETRY / END BLOCK */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              Studio Grade
            </div>
          </div>
        </div>

        {/* TOP GLOW EFFECT */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  );
}
