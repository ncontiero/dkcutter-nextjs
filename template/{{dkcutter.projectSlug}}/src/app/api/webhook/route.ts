/* eslint-disable no-console */
import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new Response("Error occurred -- could not verify webhook", {
      status: 400,
    });
  }

  return new Response("", { status: 200 });
}
