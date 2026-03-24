import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Radio, Play } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { quickListenAction } from "@/actions/get-quick-listent-tantara.action";

export default async function Home() {
  const quickListenTantara = await quickListenAction();

  return (
    <main className="relative min-h-screen bg-background transition-colors duration-500 overflow-hidden font-sans">
      {/* Absolute Dark Mode Toggle Positioning */}
      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {/* Background Decorative Elements - Themed OKLCH Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] opacity-50 dark:opacity-30" />
      <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-primary/10 rounded-full blur-[100px] opacity-60" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">
        {/* Pro Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Live from Madagascar
          </span>
        </div>

        {/* Big Heading - Optimized for Poppins Black */}
        <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-[-0.04em] mb-8 leading-[0.85]">
          Tantara <span className="text-primary">Gasy</span> <br />
          <span className="text-muted-foreground/60">FM Radio.</span>
        </h1>

        {/* Description - Optimized for Poppins Medium */}
        <p className="max-w-2xl text-lg text-muted-foreground/60 font-medium leading-relaxed mb-12 px-4">
          The ultimate free radio experience. We bring you the soulful sounds of{" "}
          <span className="text-foreground font-bold italic">
            Tantara Gasy FM
          </span>{" "}
          directly from YouTube, delivering high-quality Malagasy radio streams
          to your browser—completely free.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 items-center pt-6">
          {/* Primary Action: Explore Now */}
          <Link href="/explore" className="relative group">
            {/* Subtle Glow - Tighter radius */}
            <div className="absolute -inset-0.5 bg-primary/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500" />

            <Button
              size="lg"
              className="relative rounded-full h-14 px-10 text-lg font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden border-t border-white/10"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span>Explore Now</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Button>
          </Link>

          {/* Secondary Action: Quick Listen */}
          <Link
            href={`/listening/${quickListenTantara.id}`}
            title={quickListenTantara.title}
          >
            <Button
              variant="ghost"
              size="lg"
              className="group rounded-full h-14 px-8 text-lg font-medium gap-4 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10"
            >
              <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Play
                  size={14}
                  className="text-primary group-hover:text-primary-foreground fill-current ml-0.5 transition-colors"
                />
              </div>
              <span className="tracking-tight">Quick Listen</span>
            </Button>
          </Link>
        </div>

        {/* Visual Teaser (Spotify-style Glass Card) */}
        <div className="mt-24 w-full max-w-4xl border border-primary/10 rounded-3xl bg-card/30 backdrop-blur-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-primary/5 p-8 flex items-center gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shrink-0 shadow-lg shadow-primary/40 -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Radio size={40} />
          </div>

          <div className="text-left flex-1 space-y-3">
            <div className="h-2.5 w-32 bg-primary/30 rounded-full animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded-full" />
            <div className="h-3 w-40 bg-muted/50 rounded-full" />
          </div>

          <div className="hidden md:flex items-end gap-1.5 h-16 px-4">
            {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 1, 0.6, 0.3].map((h, i) => (
              <div
                key={i}
                className="w-2 bg-primary/30 rounded-full animate-wave"
                style={{
                  height: `${h * 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
