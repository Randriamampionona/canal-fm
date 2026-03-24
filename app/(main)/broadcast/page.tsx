import { getLiveBroadcasts } from "@/actions/get-broadcasts.action";
import { BroadcastClient } from "@/components/broadcast-client";

export default async function BroadcastPage() {
  const initialData = await getLiveBroadcasts();

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-400 mx-auto space-y-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-primary/20">
                Live Signal
              </span>
              <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-current animate-ping" />
                On Air
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase leading-[0.8] text-white">
              Global <span className="text-primary">Broadcasts</span>
            </h1>
          </div>
          <p className="max-w-sm text-zinc-500 text-xs font-medium leading-relaxed tracking-widest uppercase opacity-70">
            Real-time decryption of active Tantara Gasy transmissions. Select a
            station to join the stream.
          </p>
        </div>

        {/* CLIENT COMPONENT FOR INFINITE GRID */}
        <BroadcastClient
          initialVideos={initialData.videos}
          initialToken={initialData.nextPageToken}
        />
      </div>
    </main>
  );
}
