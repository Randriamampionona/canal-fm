import { getAllTantara } from "@/actions/get-all-tantara.action";
import { ExploreClient } from "@/components/explore-client";

export default async function ExplorePage() {
  // Initial server-side fetch for the first 12-15 items
  const initialData = await getAllTantara();

  return (
    <main className="min-h-screen py-28">
      <div className="max-w-7xl mx-auto px-6">
        <ExploreClient
          initialVideos={initialData.videos}
          initialToken={initialData.nextPageToken}
        />
      </div>
    </main>
  );
}
