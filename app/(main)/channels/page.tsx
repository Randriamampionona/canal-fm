import { Radio, ChevronRight, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const stations = [
  {
    name: "Radio Don Bosco",
    img: "/Radio Don Bosco.jpg",
    description:
      "Catholic-run station famous for educational and social dramas focusing on youth.",
    signal: "92.2 MHz",
  },
  {
    name: "Record FM",
    img: "/Record FM.jpg",
    description:
      "Focuses on short-form sketches and modern life stories blending humor.",
    signal: "91.6 MHz",
  },
  {
    name: "Radio Viva",
    img: "/Radio Viva.jpg",
    description:
      "Private station with a dedicated troupe of voice actors for contemporary serials.",
    signal: "98.8 MHz",
  },
  {
    name: "RNM - Radio Madagasikara",
    img: "/RNM (Radio Madagasikara).jpg",
    description:
      "The national public broadcaster, known as the historical home of radio drama.",
    signal: "99.2 MHz",
  },
  {
    name: "RDJ (Radio des Jeunes)",
    img: "/RDJ (Radio des Jeunes).jpg",
    description:
      "Targets a younger audience with a specialty in late-night horror and thrillers.",
    signal: "96.6 MHz",
  },
  {
    name: "Radio Fahazavana",
    img: "/Radio Fahazavana.jpg",
    description:
      "Operated by the FJKM church, featuring dramas centered on faith and community.",
    signal: "88.6 MHz",
  },
  {
    name: "Alliance 92 FM",
    img: "/Alliance 92 FM.jpg",
    description:
      "Offers a mix of translated international stories and short suspense-filled plays.",
    signal: "92.0 MHz",
  },
  {
    name: "Radio Bitsy FM",
    img: "/Radio Bitsy FM.jpg",
    description:
      "Frequently broadcasts classic radio plays performed by local theatrical troupes.",
    signal: "98.0 MHz",
  },
];

export default function ChannelsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 md:pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-12 md:pb-16">
          <div className="space-y-4 md:space-y-6">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase border border-primary/20 inline-block w-fit">
              Network Directory
            </span>
            <h1 className="text-4xl md:text-7xl font-[1000] tracking-[-0.05em] uppercase leading-[0.9]">
              Active <span className="text-primary italic">Relay</span>
            </h1>
          </div>
          <p className="max-w-xs text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-widest leading-relaxed">
            Select a station to browse their specific signal archives and
            recurring series.
          </p>
        </div>

        {/* STATION RACK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {stations.map((station, idx) => {
            const stationUrl = `/channels/radio?name=${encodeURIComponent(station.name)}`;

            return (
              <Link
                key={idx}
                href={stationUrl}
                className="group relative bg-zinc-950/40 border border-white/5 rounded-2xl md:rounded-md overflow-hidden transition-all duration-700 hover:border-primary/40 hover:bg-zinc-900/60 active:scale-[0.98] shadow-2xl"
              >
                <div className="flex flex-row h-32 sm:h-48 md:h-64">
                  {/* LEFT: STATION IMAGE */}
                  <div className="relative w-28 sm:w-48 md:w-56 h-full overflow-hidden border-r border-white/5 shrink-0">
                    <img
                      src={station.img}
                      alt={station.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] md:grayscale opacity-60 md:opacity-40 transition-all duration-700 md:group-hover:grayscale-0 md:group-hover:opacity-100 md:group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent md:hidden" />
                  </div>

                  {/* RIGHT: CONTENT */}
                  <div className="flex-1 p-4 md:p-8 flex flex-col justify-between relative min-w-0">
                    <div className="space-y-1 md:space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 md:group-hover:bg-primary md:group-hover:text-white transition-all duration-500">
                            <Radio size={12} className="md:size-3.5" />
                          </div>
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 md:group-hover:text-primary transition-colors">
                            Channel 0{idx + 1}
                          </span>
                        </div>
                        <Activity
                          size={12}
                          className="text-primary/20 md:group-hover:text-primary animate-pulse transition-colors"
                        />
                      </div>

                      <h3 className="text-lg md:text-2xl font-black text-white md:group-hover:text-primary transition-colors uppercase tracking-tight leading-tight truncate">
                        {station.name}
                      </h3>

                      <p className="hidden sm:line-clamp-2 text-[11px] md:text-sm text-zinc-500 leading-relaxed font-medium">
                        {station.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* DESKTOP TUNE IN CTA */}
                      <div className="hidden md:flex items-center gap-3 text-white group-hover:text-primary text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                        <span className="pl-2">Tune In</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight size={14} className="ml-0.5" />
                        </div>
                      </div>

                      {/* MOBILE FREQUENCY BADGE */}
                      <div className="flex md:hidden items-center gap-2">
                        <Zap size={10} className="text-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          {station.signal}
                        </span>
                      </div>

                      {/* DESKTOP DECORATION */}
                      <Zap
                        size={14}
                        className="hidden md:block text-zinc-800 group-hover:text-primary/40 transition-colors"
                      />

                      {/* MOBILE INDICATOR */}
                      <ChevronRight
                        size={16}
                        className="text-primary/40 md:hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* BACKGROUND GLOW */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full md:group-hover:bg-primary/10 transition-all duration-1000" />
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
