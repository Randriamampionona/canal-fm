"use server";

import { TantaraVideo } from "@/typing";

const API_KEYs = [
  process.env.YOUTUBE_API_KEY_V1!,
  process.env.YOUTUBE_API_KEY_V2!,
  process.env.YOUTUBE_API_KEY_V3!,
  process.env.YOUTUBE_API_KEY_V4!,
  process.env.YOUTUBE_API_KEY_V5!,
];
const randomIndex = Math.floor(Math.random() * API_KEYs.length);
const activeKey = API_KEYs[randomIndex];

export async function getTantaraDetails(
  id: string,
): Promise<TantaraVideo | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${activeKey}`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}
