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
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToPlaylist, removeFromPlaylist } from "@/actions/playlist-actions";
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

  const handleProtectedAction = (action: () => void) => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }
    action();
  };

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

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    const unsub = onSnapshot(doc(db, "playlists", userId), (doc) => {
      if (doc.exists()) {
        const tracks = doc.data().tracks || [];
        setIsInPlaylist(tracks.some((track: any) => track.id === video.id));
      }
    });
    return () => unsub();
  }, [userId, isSignedIn, video.id]);

  const handlePlaylistToggle = async () => {
    setIsSyncing(true);
    try {
      isInPlaylist
        ? await removeFromPlaylist(video)
        : await addToPlaylist(video);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    const unsub = onSnapshot(doc(db, "favorites", userId), (doc) => {
      if (doc.exists()) {
        const items = doc.data().items || [];
        setIsLiked(items.some((item: any) => item.id === video.id));
      }
    });
    return () => unsub();
  }, [userId, isSignedIn, video.id]);

  const handleLikeToggle = async () => {
    setIsLikeSyncing(true);
    try {
      isLiked ? await removeFromFavorites(video) : await addToFavorites(video);
    } finally {
      setIsLikeSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 md:gap-20">
        {/* ARTWORK - Responsive sizing */}
        <div className="w-64 h-64 md:w-100 md:h-100 lg:w-110 lg:h-110 shrink-0 group relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative aspect-square rounded-md overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 h-full w-full">
            <img
              src={video.thumbnail}
              className="object-cover h-full w-full transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-2"
              alt={video.title}
            />
          </div>
        </div>

        {/* TYPOGRAPHY & ACTIONS */}
        <div className="flex-1 space-y-6 md:space-y-10 w-full text-center lg:text-left px-4">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase border bg-primary/10 text-primary border-primary/20">
                Broadcasting Signal
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-[1000] text-white tracking-tighter uppercase leading-[0.95] line-clamp-5">
              {video.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2">
            {/* PRO DOWNLOAD BUTTON */}
            <Button
              onClick={() => handleProtectedAction(executeBridge)}
              className={`
                relative h-14 md:h-16 px-6 md:px-10 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]
                transition-all duration-500 active:scale-95 flex items-center gap-3
                ${copied ? "bg-primary text-white" : "bg-white text-black hover:bg-zinc-900 hover:text-white"}
              `}
            >
              {copied ? <Check size={16} /> : <Download size={16} />}
              <span>{copied ? "Copied" : "Extract Audio"}</span>
            </Button>

            {/* QUICK ACTIONS ROW */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                disabled={isLikeSyncing}
                onClick={() => handleProtectedAction(handleLikeToggle)}
                className={`rounded-full w-14 h-14 md:w-16 md:h-16 border-white/5 bg-zinc-900/50 backdrop-blur-md transition-all active:scale-90 ${isLiked ? "border-red-500/50 bg-red-500/10" : ""}`}
              >
                {isLikeSyncing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Heart
                    size={18}
                    className={isLiked ? "fill-red-500 text-red-500" : ""}
                  />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={isSyncing}
                onClick={() => handleProtectedAction(handlePlaylistToggle)}
                className={`rounded-full w-14 h-14 md:w-16 md:h-16 border-white/5 bg-zinc-900/50 backdrop-blur-md transition-all active:scale-90 ${isInPlaylist ? "border-primary/50 bg-primary/10 text-primary" : ""}`}
              >
                {isSyncing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isInPlaylist ? (
                  <ListCheck size={18} />
                ) : (
                  <ListPlus size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* BRIDGE MODAL - Modernized */}
      {isBridging && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-primary/20 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto mb-6">
              <ShieldCheck size={36} className="text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
              Bridge Engaged
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose mb-8">
              Signal source copied to clipboard. <br /> Initialize extraction in
              terminal tab.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setIsBridging(false)}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-[10px] tracking-widest"
              >
                BACK TO STATION
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={copyManually}
                  className="rounded-2xl h-12 text-[8px] font-black tracking-widest uppercase border-white/5 bg-white/5"
                >
                  {manualCopied ? "DONE" : "RE-COPY"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(bridgeUrl, "_blank")}
                  className="rounded-2xl h-12 text-[8px] font-black tracking-widest uppercase border-white/5 bg-white/5"
                >
                  OPEN LINK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
