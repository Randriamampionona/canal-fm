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

export async function getLiveBroadcasts(nextToken?: string) {
  try {
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
      part: "snippet",
      q: BASE_QUERY,
      type: "video",
      eventType: "live",
      maxResults: "12",
      key: activeKey,
    });

    if (nextToken) params.append("pageToken", nextToken);

    const res = await fetch(`${baseUrl}?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    const data = await res.json();

    if (!data.items) return { videos: [], nextPageToken: null };

    const videos: TantaraVideo[] = data.items.map((v: any) => ({
      id: v.id.videoId,
      title: v.snippet.title
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&"),
      thumbnail:
        v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url,
      channelTitle: v.snippet.channelTitle,
      publishedAt: v.snippet.publishedAt,
    }));

    return {
      videos,
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error("Broadcast Fetch Error:", error);
    return { videos: [], nextPageToken: null };
  }
}
