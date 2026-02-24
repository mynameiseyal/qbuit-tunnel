import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";

const KV_KEY = "tunnel_url";

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const redis = getRedis();
    const url = await redis.get<string>(KV_KEY);
    if (!url) {
      return res.status(404).json({ error: "No tunnel URL configured yet" });
    }
    return res.status(200).json({ url });
  }

  if (req.method === "POST") {
    const secret = process.env.TUNNEL_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const { url, secret: reqSecret } = req.body;

    if (reqSecret !== secret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'url' field" });
    }

    const redis = getRedis();
    await redis.set(KV_KEY, url);
    return res.status(200).json({ ok: true, url });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
