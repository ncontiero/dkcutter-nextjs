import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    // eslint-disable-next-line no-console
    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new NextResponse("Error occurred -- could not verify webhook", {
      status: 400,
    });
  }

  return new NextResponse("", { status: 200 });
}
