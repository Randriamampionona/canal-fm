import { PageHeader } from "@/components/page-header";
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
        <PageHeader
          badge="Encrypted Storage"
          title="Personal"
          highlight="Archives"
          description="Accessing your saved audio streams, historical frequency data, and curated signal collections."
        />

        <PlaylistTerminal userId={userId} />
      </div>
    </main>
  );
}
