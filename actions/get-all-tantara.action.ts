"use server";

import { TantaraVideo } from "@/typing";

const BASE_QUERY = process.env.BASE_QUERY!;
const API_KEYs = [
  process.env.YOUTUBE_API_KEY_V1!,
  process.env.YOUTUBE_API_KEY_V2!,
  process.env.YOUTUBE_API_KEY_V3!,
  process.env.YOUTUBE_API_KEY_V4!,
  process.env.YOUTUBE_API_KEY_V5!,
];
const randomIndex = Math.floor(Math.random() * API_KEYs.length);
const activeKey = API_KEYs[randomIndex];

// get-all-tantara.action.ts
export async function getAllTantara(pageToken?: string) {
  // URL now handles the pageToken dynamically
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(BASE_QUERY)}&type=video&key=${activeKey}${pageToken ? `&pageToken=${pageToken}` : ""}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return getMockData();

    const data = await response.json();
    const videos: TantaraVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return { videos, nextPageToken: data.nextPageToken };
  } catch (error) {
    return getMockData();
  }
}

// PRO Fallback: Keeps your UI looking great even without an API key
function getMockData() {
  return {
    videos: Array.from({ length: 10 }).map((_, i) => ({
      id: `mock-${i}`,
      title: `[Offline Mode] Tantara Gasy Episode ${i + 1} - Radio Drama`,
      thumbnail: `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop`,
      channelTitle: "Canal FM Archive",
      publishedAt: new Date().toISOString(),
    })),
    nextPageToken: null,
  };
}
