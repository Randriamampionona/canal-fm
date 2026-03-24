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

export async function getRadioTantara(channelName: string, nextToken?: string) {
  const baseUrl = "https://www.googleapis.com/youtube/v3/search";
  const params = new URLSearchParams({
    part: "snippet",
    maxResults: "24",
    q: `${channelName} Tantara Gasy`,
    type: "video",
    videoEmbeddable: "true",
    key: activeKey,
  });

  if (nextToken) params.append("pageToken", nextToken);

  const res = await fetch(`${baseUrl}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  const videos: TantaraVideo[] = (data.items || []).map((item: any) => ({
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
