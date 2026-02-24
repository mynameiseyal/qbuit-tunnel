import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const KV_KEY = "tunnel_url";

export async function GET() {
  const url = await kv.get<string>(KV_KEY);
  if (!url) {
    return NextResponse.json(
      { error: "No tunnel URL configured yet" },
      { status: 404 }
    );
  }
  return NextResponse.json({ url });
}

export async function POST(request: NextRequest) {
  const secret = process.env.TUNNEL_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const body = await request.json();

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'url' field" },
      { status: 400 }
    );
  }

  await kv.set(KV_KEY, body.url);
  return NextResponse.json({ ok: true, url: body.url });
}
