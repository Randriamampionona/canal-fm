import PlaylistTerminal from "@/components/playlist-terminal";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PlaylistsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight italic">
            YOUR <span className="text-primary">TERMINAL</span>
          </h1>
          <p className="text-zinc-500 mt-2 uppercase tracking-widest text-xs">
            Stored Frequencies & Saved Signals
          </p>
        </header>

        <PlaylistTerminal userId={userId} />
      </div>
    </main>
  );
}
