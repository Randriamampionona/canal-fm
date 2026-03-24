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
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase border border-primary/20">
              Network Directory
            </span>
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase leading-tight">
              Broadcasting <span className="text-primary">Stations</span>
            </h1>
          </div>
          <p className="max-w-xs text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Select a station to browse their specific signal archives and
            recurring series.
          </p>
        </div>

        {/* STATION RACK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stations.map((station, idx) => {
            const stationUrl = `/channels/radio?name=${encodeURIComponent(station.name)}`;

            return (
              <div
                key={idx}
                className="group relative bg-zinc-950/40 border border-white/5 rounded-md overflow-hidden transition-all duration-700 hover:border-primary/40 hover:bg-zinc-900/60 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* LEFT: STATION IMAGE */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden border-b sm:border-b-0 sm:border-r border-white/5">
                    <img
                      src={station.img}
                      alt={station.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent sm:bg-linear-to-r" />
                  </div>

                  {/* RIGHT: CONTENT */}
                  <div className="flex-1 p-8 flex flex-col justify-between relative">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <Radio size={14} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-primary transition-colors">
                            Channel 0{idx + 1}
                          </span>
                        </div>
                        <Activity
                          size={14}
                          className="text-primary/20 group-hover:text-primary animate-pulse transition-colors"
                        />
                      </div>

                      <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-none">
                        {station.name}
                      </h3>

                      <p className="text-sm text-zinc-500 leading-relaxed font-medium line-clamp-2">
                        {station.description}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <Link href={stationUrl}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto hover:bg-transparent text-white group-hover:text-primary text-[10px] font-black uppercase tracking-[0.3em] flex gap-3 pl-2 items-center group/btn transition-colors"
                        >
                          Tune In
                          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight size={12} className="ml-0.5" />
                          </div>
                        </Button>
                      </Link>

                      <Zap
                        size={14}
                        className="text-zinc-800 group-hover:text-primary/40 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* BACKGROUND GLOW */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
