"use client";

import { useEffect, useState } from "react";
import { TantaraVideo } from "@/typing";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Heart,
  ListPlus,
  Check,
  X,
  ShieldCheck,
  Copy,
  RotateCcw,
  Download,
  Loader2,
  ListCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToPlaylist, removeFromPlaylist } from "@/actions/playlist-actions";
import { toast } from "sonner";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/actions/favorite-actions";

export function SignalDisplay({ video }: { video: TantaraVideo }) {
  const { isSignedIn, userId } = useAuth();
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeSyncing, setIsLikeSyncing] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [isBridging, setIsBridging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualCopied, setManualCopied] = useState(false);

  const ytUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const bridgeUrl = "https://app.ytdown.to/en23/";

  // --- AUTH GUARD WRAPPER ---
  const handleProtectedAction = (action: () => void) => {
    if (!isSignedIn) {
      // Redirect to sign-in and return here after
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }
    action();
  };

  // Logic for extraction (protected)
  const executeBridge = () => {
    navigator.clipboard.writeText(ytUrl).then(() => {
      setCopied(true);
      setIsBridging(true);
      window.open(bridgeUrl, "_blank");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const copyManually = () => {
    navigator.clipboard.writeText(ytUrl).then(() => {
      setManualCopied(true);
      setTimeout(() => setManualCopied(false), 2000);
    });
  };

  const onLike = () => {
    console.log("Saving Signal to Terminal Favorites...");
  };

  // REAL-TIME TERMINAL SYNC
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    // Listen to this user's playlist document
    const unsub = onSnapshot(doc(db, "playlists", userId), (doc) => {
      if (doc.exists()) {
        const tracks = doc.data().tracks || [];
        const found = tracks.some((track: any) => track.id === video.id);
        setIsInPlaylist(found);
      } else {
        setIsInPlaylist(false);
      }
    });

    return () => unsub(); // Cleanup on unmount
  }, [userId, isSignedIn, video.id]);

  const handlePlaylistToggle = async () => {
    setIsSyncing(true);
    try {
      if (isInPlaylist) {
        await removeFromPlaylist(video);
      } else {
        await addToPlaylist(video);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // REAL-TIME FAVORITES SYNC
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    const unsub = onSnapshot(doc(db, "favorites", userId), (doc) => {
      if (doc.exists()) {
        const items = doc.data().items || [];
        const found = items.some((item: any) => item.id === video.id);
        setIsLiked(found);
      } else {
        setIsLiked(false);
      }
    });

    return () => unsub();
  }, [userId, isSignedIn, video.id]);

  const handleLikeToggle = async () => {
    setIsLikeSyncing(true);
    try {
      if (isLiked) {
        await removeFromFavorites(video);
      } else {
        await addToFavorites(video);
      }
    } finally {
      setIsLikeSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 lg:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-20">
        {/* ARTWORK */}
        <div className="w-full max-w-100 lg:max-w-110 shrink-0 group">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_80px_100px_-40px_rgba(0,0,0,0.7)] border border-white/10">
            <img
              src={video.thumbnail}
              className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-105"
              alt={video.title}
            />
          </div>
        </div>

        {/* TYPOGRAPHY & ACTIONS */}
        <div className="flex-1 space-y-10 w-full text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="px-3 py-1 rounded-sm text-[9px] font-black tracking-[0.3em] uppercase border bg-primary/10 text-primary border-primary/20">
                Broadcasting
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter uppercase leading-[0.9]">
              {video.title}
            </h1>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            {/* NOW PROTECTED DOWNLOAD BUTTON */}
            <Button
              onClick={() => handleProtectedAction(executeBridge)}
              className={`
                relative group overflow-hidden
                rounded-full h-16 px-10 
                font-black text-[10px] uppercase tracking-[0.3em]
                transition-all duration-500 active:scale-95
                flex items-center gap-4
                ${
                  copied
                    ? "bg-primary text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border-primary/50"
                    : "bg-white text-black hover:bg-zinc-950 hover:text-white border-white/10"
                }
                border shadow-2xl
              `}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

              <div className="relative flex items-center justify-center">
                {copied ? (
                  <Check
                    size={18}
                    className="animate-in zoom-in duration-300"
                  />
                ) : (
                  <>
                    <Download
                      size={18}
                      className="group-hover:-translate-y-1 transition-transform duration-300"
                    />
                    <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </div>

              <span className="relative z-10">
                {copied ? "Signal Copied" : "Download Audio"}
              </span>
            </Button>

            {/* GUARDED LIKE BUTTON */}
            <Button
              variant="outline"
              size="icon"
              disabled={isLikeSyncing}
              onClick={() => handleProtectedAction(handleLikeToggle)}
              className={`
                rounded-full w-16 h-16 border-white/10 bg-zinc-900 transition-all group active:scale-90
                ${isLiked ? "border-red-500/30 bg-red-500/5" : "hover:text-primary hover:border-primary/50 hover:bg-primary/5"}
              `}
            >
              {isLikeSyncing ? (
                <Loader2 size={22} className="animate-spin text-red-500/50" />
              ) : (
                <Heart
                  size={22}
                  className={`
            transition-all duration-300 group-hover:scale-110
            ${isLiked ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"}
          `}
                />
              )}
            </Button>

            {/* GUARDED PLAYLIST BUTTON */}
            <Button
              variant="outline"
              size="icon"
              disabled={isSyncing}
              onClick={() => handleProtectedAction(handlePlaylistToggle)}
              className={`
                rounded-full w-16 h-16 border-white/10 bg-zinc-900 transition-all group active:scale-90
                ${isInPlaylist ? "text-primary border-primary/50 bg-primary/5" : "hover:text-primary hover:border-primary/50 hover:bg-primary/5"}
              `}
            >
              {isSyncing ? (
                <Loader2 size={22} className="animate-spin text-primary/50" />
              ) : isInPlaylist ? (
                <ListCheck
                  size={22}
                  className="text-primary animate-in zoom-in duration-300"
                />
              ) : (
                <ListPlus
                  size={22}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL BRIDGE UI */}
      {isBridging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          {/* Modal content remains the same... */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-primary/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <button
              onClick={() => setIsBridging(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck size={32} className="text-primary animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  Bridge Engaged
                </h2>
                <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-[0.15em]">
                  Paste the link into the converter tab <br /> to begin signal
                  extraction.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <Button
                  onClick={() => setIsBridging(false)}
                  className="w-full rounded-xl h-14 bg-primary text-white font-bold uppercase text-[10px] tracking-widest hover:brightness-110 shadow-lg shadow-primary/20"
                >
                  Return to Station
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={copyManually}
                    variant="outline"
                    className="rounded-xl h-14 border-white/5 bg-white/5 text-zinc-300 font-bold uppercase text-[9px] tracking-widest hover:bg-white/10 flex gap-2"
                  >
                    {manualCopied ? <Check size={14} /> : <Copy size={14} />}
                    {manualCopied ? "Copied" : "Manual Copy"}
                  </Button>

                  <Button
                    onClick={() => window.open(bridgeUrl, "_blank")}
                    variant="outline"
                    className="rounded-xl h-14 border-white/5 bg-white/5 text-zinc-300 font-bold uppercase text-[9px] tracking-widest hover:bg-white/10 flex gap-2"
                  >
                    <RotateCcw size={14} />
                    Open Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
