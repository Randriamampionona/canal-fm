"use server";

import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { TantaraVideo } from "@/typing";

export async function addToFavorites(video: TantaraVideo) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const favoriteRef = doc(db, "favorites", userId);

  try {
    await setDoc(
      favoriteRef,
      {
        userId,
        lastUpdated: new Date().toISOString(),
        items: arrayUnion({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          likedAt: new Date().toISOString(),
        }),
      },
      { merge: true },
    );
    return { success: true };
  } catch (error) {
    console.error("Signal favoriting failed:", error);
    return { success: false };
  }
}

export async function removeFromFavorites(video: TantaraVideo) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const favoriteRef = doc(db, "favorites", userId);

  try {
    const docSnap = await getDoc(favoriteRef);
    if (!docSnap.exists()) return { success: false };

    const items = docSnap.data().items || [];
    const itemToRemove = items.find((item: any) => item.id === video.id);

    if (itemToRemove) {
      await updateDoc(favoriteRef, {
        items: arrayRemove(itemToRemove),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Signal unfavoriting failed:", error);
    return { success: false };
  }
}
