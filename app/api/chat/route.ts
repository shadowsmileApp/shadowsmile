import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Read request body safely (prevents crashes)
    const body = await req.json().catch(() => ({}));
    const message = body?.message;

    return NextResponse.json({
      reply:
        "ShadowSmile AI is currently under development and will be available in a future update 🚀",
      received: message || null,
      status: "AI_DISABLED",
    });
  } catch (error) {
    return NextResponse.json(
      {
        reply:
          "ShadowSmile AI is currently unavailable, but will return in a future update 🚀",
        status: "ERROR_SAFE_MODE",
      },
      { status: 200 }
    );
  }
}
