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

export async function searchTantara(query: string, nextToken?: string) {
  const refinedQuery = `${BASE_QUERY} ${query}`;

  const baseUrl = "https://www.googleapis.com/youtube/v3/search";
  const params = new URLSearchParams({
    part: "snippet",
    maxResults: "25",
    q: refinedQuery,
    type: "video",
    videoEmbeddable: "true",
    regionCode: "MG",
    key: activeKey,
  });

  if (nextToken) params.append("pageToken", nextToken);

  const res = await fetch(`${baseUrl}?${params.toString()}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (data.error) {
    console.error("YouTube API Error:", data.error.message);
    return { videos: [], nextPageToken: null };
  }

  const videos: TantaraVideo[] = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&"),
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
  };
}
