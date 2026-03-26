"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Radio,
  FastForward,
  Rewind,
} from "lucide-react";
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
  const [barCount, setBarCount] = useState(60);

  const playerRef = useRef<any>(null);

  // Responsive visualizer bars
  useEffect(() => {
    const handleResize = () => setBarCount(window.innerWidth < 768 ? 30 : 60);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        const total = playerRef.current.getDuration();
        if (total > 0) setPlayed(playerRef.current.getCurrentTime() / total);
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

  const skip = (seconds: number) => {
    if (!isReady) return;
    const current = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(current + seconds, true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-12 md:mt-16 relative w-full max-w-5xl mx-auto px-4 md:px-0">
      <div id="youtube-player" className="hidden" />

      <div className="relative overflow-hidden bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-3xl md:rounded-[2rem] p-6 md:p-12 shadow-2xl">
        {/* WAVEFORM - Responsive density */}
        <div className="h-16 md:h-24 w-full flex items-end justify-center gap-1 md:gap-1.5 mb-8 md:mb-12">
          {[...Array(barCount)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-300 ${playing ? "bg-primary/50" : "bg-zinc-800 h-1"}`}
              style={{
                height: playing
                  ? `${Math.max(15, Math.random() * 100)}%`
                  : "4px",
                transitionDelay: `${i * 5}ms`,
              }}
            />
          ))}
        </div>

        <div className="space-y-8 md:space-y-10">
          {/* SCRUBBER */}
          <div className="relative pt-2">
            <Slider
              value={[played]}
              max={1}
              step={0.0001}
              onValueChange={(v) =>
                playerRef.current?.seekTo(v[0] * duration, true)
              }
              className="cursor-pointer"
            />
            <div className="flex justify-between mt-4 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              <span className={playing ? "text-primary animate-pulse" : ""}>
                {formatTime(played * duration)}
              </span>
              <div className="items-center gap-2 opacity-50 flex">
                <Radio size={10} className="animate-pulse" />
                <span>Live Signal Link</span>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* CONTROLS HUB */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* VOLUME - Hidden/Compact on mobile */}
            <div className="hidden md:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/5 w-48">
              <button
                onClick={() => {
                  const n = !muted;
                  setMuted(n);
                  playerRef.current?.setVolume(n ? 0 : volume);
                }}
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

            {/* PLAYBACK HUB */}
            <div className="flex items-center gap-6 md:gap-10">
              <button
                onClick={() => skip(-10)}
                className="text-zinc-500 hover:text-white transition-all active:scale-75"
              >
                <Rewind size={24} />
              </button>

              <Button
                onClick={togglePlay}
                disabled={!isReady}
                className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-90 group"
              >
                {playing ? (
                  <Pause size={32} fill="currentColor" />
                ) : (
                  <Play size={32} fill="currentColor" className="ml-1" />
                )}
              </Button>

              <button
                onClick={() => skip(10)}
                className="text-zinc-500 hover:text-white transition-all active:scale-75"
              >
                <FastForward size={24} />
              </button>
            </div>

            {/* STATUS - Right side */}
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <div
                className={`w-2 h-2 rounded-full ${playing ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
              />
              {playing ? "Active" : "Standby"}
            </div>
          </div>
        </div>

        {/* PRO DECORATION */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
          <div
            className={`h-full bg-primary transition-all duration-500 ${playing ? "w-full" : "w-0"}`}
            style={{ opacity: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
