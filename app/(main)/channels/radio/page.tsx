import { getRadioTantara } from "@/actions/get-radio-tantara.action";
import { RadioClient } from "@/components/radio-client";
import { Radio, Zap } from "lucide-react";
import { stations } from "../page"; // Importing your exported array

export default async function RadioStationPage({
  searchParams,
}: {
  searchParams: Promise<{ name: string }>;
}) {
  const { name } = await searchParams;
  const initialData = await getRadioTantara(name);

  // Correctly find the station from the exported array
  const info = stations.find((s) => s.name === name) || {
    name: "Unknown",
    img: "",
    description: "Active broadcasting frequency part of the Tantara network.",
    signal: "104.2 MHz",
  };

  return (
    <main className="min-h-screen bg-black pt-20.25 pb-20">
      {/* --- CINEMATIC STATION BANNER --- */}
      <div className="relative h-[45vh] w-full overflow-hidden border-b border-white/5 mb-16">
        {/* IMAGE LAYER: Background Bleed */}
        {info.img && (
          <div className="absolute inset-0">
            <img
              src={info.img}
              alt=""
              className="w-full h-full opacity-80 blur-xs"
            />
            {/* Multi-stage gradients to blend the image into the black UI */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black" />
            <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />
          </div>
        )}

        {/* CONTENT LAYER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-primary shadow-2xl">
              <Radio size={32} />
            </div>
            <div className="h-px w-24 bg-linear-to-r from-primary to-transparent" />
          </div>

          <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase text-white mb-4 drop-shadow-2xl">
            {name}
          </h1>
          <p className="max-w-2xl text-zinc-400 font-medium text-sm md:text-base balance leading-relaxed opacity-80">
            {info.description}
          </p>

          <div className="mt-8 flex items-center gap-6 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              <Zap size={14} fill="currentColor" className="animate-pulse" />
              Signal: {info.signal}
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Status: <span className="text-emerald-500">Synchronized</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <RadioClient
          initialVideos={initialData.videos}
          initialToken={initialData.nextPageToken}
          channelName={name}
        />
      </div>
    </main>
  );
}
