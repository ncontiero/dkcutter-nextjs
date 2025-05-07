/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }

  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return res.status(400).json({ Error: error });
  }

  return res.status(200).json({ response: "Success" });
}
