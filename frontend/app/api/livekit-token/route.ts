import { NextResponse } from "next/server";
import {
  AccessToken,
  RoomAgentDispatch,
  RoomConfiguration,
} from "livekit-server-sdk";

const AGENT_NAME = "Test-Helper";

export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return NextResponse.json(
      {
        error:
          "LiveKit not configured. Set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL.",
      },
      { status: 503 },
    );
  }

  // Production note: For public deployments, verify the user's authenticated session
  // (e.g. via NextAuth, Clerk, or session cookie) before generating access tokens
  // to prevent unauthenticated credit and quota exhaustion.

  const identity = `user-${crypto.randomUUID()}`;
  const roomName = `support-${Date.now()}`;

  // Restrict TTL to 10 minutes (sufficient for initial session negotiation)
  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: 60 * 10,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, serverUrl });
}
