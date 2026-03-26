"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { removeFromPlaylist } from "@/actions/playlist-actions";
import {
  Play,
  Trash2,
  Music,
  Clock,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function PlaylistTerminal({ userId }: { userId: string }) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "playlists", userId), (doc) => {
      if (doc.exists()) {
        setTracks(doc.data().tracks || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <Activity className="text-primary animate-pulse" size={40} />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Syncing Archives...
        </span>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="relative group overflow-hidden border border-white/5 rounded-[2rem] p-12 md:p-24 text-center bg-zinc-950 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-white/5">
          <Music
            className="text-zinc-700 group-hover:text-primary transition-colors duration-700"
            size={32}
          />
        </div>
        <h3 className="relative text-lg font-black text-white uppercase tracking-tighter mb-2">
          Vault Offline
        </h3>
        <p className="relative text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-10 max-w-xs mx-auto">
          No signal data has been archived in this sector yet.
        </p>
        <Link href="/explore" className="relative z-10">
          <Button className="bg-primary text-white hover:bg-white hover:text-black rounded-full px-10 h-14 font-black text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20">
            INITIALIZE SCAN
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER LABEL */}
      <div className="hidden md:flex items-center px-8 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
        <span className="w-12">#</span>
        <span className="grow">Stored Frequency / Source</span>
        <span className="w-32 text-right">Extraction Date</span>
        <span className="w-24 text-right">Control</span>
      </div>

      <div className="flex flex-col gap-3">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="group relative flex items-center gap-4 md:gap-6 p-2 md:p-3 rounded-2xl md:rounded-lg bg-zinc-900/10 border border-white/5 hover:border-primary/40 hover:bg-zinc-900/40 transition-all duration-500 overflow-hidden"
          >
            {/* INDEX */}
            <span className="hidden md:block w-12 pl-4 text-[11px] font-mono font-bold text-zinc-700 group-hover:text-primary transition-colors">
              {(index + 1).toString().padStart(2, "0")}
            </span>

            {/* THUMBNAIL */}
            <Link
              href={`/listening/${track.id}`}
              className="relative h-20 w-20 md:h-16 md:w-28 shrink-0 overflow-hidden rounded-xl md:rounded-md border border-white/10 shadow-xl"
            >
              <Image
                src={track.thumbnail}
                alt={track.title}
                fill
                className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={24} className="text-white fill-white" />
              </div>
            </Link>

            {/* INFO - LINE CLAMPED */}
            <div className="grow min-w-0 py-1 flex flex-col justify-center gap-1.5">
              <Link href={`/listening/${track.id}`}>
                <h3 className="text-xs md:text-sm font-bold text-zinc-100 line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-[1.3] md:leading-snug">
                  {track.title}
                </h3>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-primary/60" />
                  <span className="text-[8px] md:text-[9px] text-zinc-500 font-black uppercase tracking-widest truncate max-w-25 md:max-w-none">
                    {track.channelTitle || "Unknown Station"}
                  </span>
                </div>

                {/* Mobile Date Badge */}
                <span className="md:hidden text-[8px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-sm">
                  {new Date(track.addedAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* DESKTOP DATE */}
            <div className="hidden md:flex items-center justify-end w-32 text-zinc-600 font-mono text-[10px]">
              <Clock size={12} className="mr-2 opacity-40" />
              {new Date(track.addedAt).toLocaleDateString()}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-1 md:gap-3 pr-2 md:pr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromPlaylist(track)}
                className="w-10 h-10 rounded-full text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
              >
                <Trash2 size={16} />
              </Button>

              <Link href={`/listening/${track.id}`} className="hidden md:block">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>

            {/* DECORATIVE SCANLINE (Subtle Pro touch) */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-primary/0 via-primary/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        ))}
      </div>
    </div>
  );
}
