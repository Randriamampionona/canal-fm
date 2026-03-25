import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase-admin";

const IS_PROD = process.env.NODE_ENV == "production";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = IS_PROD
    ? process.env.CLERK_WEBHOOK_SECRET
    : process.env.CLERK_WEBHOOK_SECRET_DEV;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;

    // Save to Firestore under "users" collection
    await db
      .collection("users")
      .doc(id)
      .set({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: `${first_name} ${last_name}`.trim(),
        avatar: image_url,
        createdAt: new Date().toISOString(),
        role: "member", // Default role for Canal FM
        favorites: [],
        playlists: [],
      });

    console.log(`User ${id} synced to Firestore Terminal`);
  }

  return new Response("", { status: 200 });
}
