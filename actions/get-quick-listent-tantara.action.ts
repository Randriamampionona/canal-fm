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

export async function quickListenAction(): Promise<TantaraVideo> {
  const activeKey = API_KEYs[Math.floor(Math.random() * API_KEYs.length)];
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(
    BASE_QUERY,
  )}&type=video&key=${activeKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
      throw new Error("Frequency Jammed");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return getMockSignal();
    }

    // Pick a random frequency from the results
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const item = data.items[randomIndex];

    // Return the full PRO TantaraVideo object
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (error) {
    console.error("Signal Lost. Switching to Archive.");
    return getMockSignal();
  }
}

// PRO Fallback Archive
function getMockSignal(): TantaraVideo {
  return {
    id: "mock-random",
    title: "[Archive] Tantara Gasy - Classic Radio Drama",
    thumbnail:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800",
    channelTitle: "Canal FM Archive",
    publishedAt: new Date().toISOString(),
  };
}
