"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { removeFromPlaylist } from "@/actions/playlist-actions";
import { Play, Trash2, Music, Clock, Activity, ArrowRight } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Activity className="text-primary animate-pulse" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Initializing Terminal...
        </span>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="relative group overflow-hidden border border-white/5 rounded-[2rem] p-24 text-center bg-zinc-950 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <Music
          className="relative mx-auto text-zinc-800 mb-6 group-hover:text-primary/40 transition-colors duration-700"
          size={64}
        />
        <p className="relative text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">
          The Vault is Currently Empty
        </p>
        <Link href="/explore" className="relative z-10">
          <Button className="bg-white text-black hover:bg-primary hover:text-white rounded-full px-10 h-14 font-black text-[10px] tracking-widest transition-all active:scale-95">
            START BROADCASTING
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER LABEL */}
      <div className="flex items-center px-8 mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
        <span className="w-12">#</span>
        <span className="grow">Stored Frequency</span>
        <span className="hidden md:block w-32 text-right">Extraction Date</span>
        <span className="w-24 text-right">Control</span>
      </div>

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="group relative flex items-center gap-6 p-3 rounded-md bg-zinc-900/20 border border-white/5 hover:border-primary/40 hover:bg-zinc-900/60 transition-all duration-500 shadow-lg"
          >
            {/* AMBIENT GLOW BACKDROP */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 rounded-2xl" />

            {/* INDEX */}
            <span className="relative w-12 pl-4 text-[11px] font-mono font-bold text-zinc-700 group-hover:text-primary transition-colors">
              {(index + 1).toString().padStart(2, "0")}
            </span>

            {/* THUMBNAIL */}
            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-white/10 shadow-xl">
              <Image
                src={track.thumbnail}
                alt={track.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Play size={18} className="text-white fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="relative grow min-w-0">
              <h3 className="text-sm font-bold text-zinc-100 truncate group-hover:text-white transition-colors tracking-tight">
                {track.title}
              </h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
                Signal Verified
              </p>
            </div>

            {/* DATE */}
            <div className="relative hidden md:flex items-center justify-end w-32 text-zinc-600 group-hover:text-zinc-400 transition-colors">
              <Clock size={12} className="mr-2" />
              <span className="text-[10px] font-mono">
                {new Date(track.addedAt).toLocaleDateString()}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="relative flex items-center justify-end gap-2 w-24 pr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromPlaylist(track)}
                className="w-10 h-10 rounded-full text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
              >
                <Trash2 size={16} />
              </Button>
              <Link href={`/listening/${track.id}`}>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 text-zinc-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 transition-all">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
