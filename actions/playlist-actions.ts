"use server";

import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  arrayUnion,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { TantaraVideo } from "@/typing";

export async function addToPlaylist(video: TantaraVideo) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Terminal Access Denied");
  }

  const playlistRef = doc(db, "playlists", userId);

  try {
    // We use setDoc with merge: true so the document is created if it doesn't exist
    await setDoc(
      playlistRef,
      {
        userId,
        updatedAt: new Date().toISOString(),
        // Adding the video object to the tracks array
        tracks: arrayUnion({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          addedAt: new Date().toISOString(),
        }),
      },
      { merge: true },
    );

    return { success: true };
  } catch (error) {
    console.error("Playlist injection failed:", error);
    return { success: false, error: "Failed to sync with playlist" };
  }
}

export async function removeFromPlaylist(video: TantaraVideo) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const playlistRef = doc(db, "playlists", userId);

  try {
    // We fetch the doc to ensure we match the exact object in the array
    const docSnap = await getDoc(playlistRef);
    if (!docSnap.exists()) return { success: false };

    const tracks = docSnap.data().tracks || [];
    const trackToRemove = tracks.find((t: any) => t.id === video.id);

    if (trackToRemove) {
      await updateDoc(playlistRef, {
        tracks: arrayRemove(trackToRemove),
        updatedAt: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Extraction failed:", error);
    return { success: false };
  }
}
