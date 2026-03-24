import { notFound } from "next/navigation";
import { getTantaraDetails } from "@/actions/get-tantara-details.action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SignalDisplay } from "@/components/listening/signal-display";
import { SignalEngine } from "@/components/listening/signal-engine";

export default async function ListeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getTantaraDetails(id);

  if (!video) notFound();

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* --- AMBIENT LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={video.thumbnail}
          className="w-full h-full object-cover opacity-20 blur-[100px] saturate-150 scale-125"
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        <Link href="/explore">
          <Button
            variant="ghost"
            className="mb-12 -ml-3 gap-2 text-muted-foreground hover:text-primary font-black uppercase tracking-[0.3em] text-[9px]"
          >
            <ArrowLeft size={14} /> Return to Frequency
          </Button>
        </Link>

        <SignalDisplay video={video} />

        <SignalEngine id={id} />
      </div>
    </main>
  );
}
