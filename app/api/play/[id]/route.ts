import { NextRequest } from "next/server";
import { recordingsData } from "@/app/lib/recordings";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Authorization header missing or malformed",
      }),
      { status: 400 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const recording = recordingsData.find(rc => rc.id === params.id);

    if (!recording) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Recording not found",
        }),
        { status: 404 }
      );
    }

    if (!Array.isArray(recording.audioData)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Audio data is invalid",
        }),
        { status: 500 }
      );
    }

    const audioBuffers = recording.audioData.map((base64Str: string) => {
      const base64 = base64Str.split(",")[1];
      return Buffer.from(base64, "base64");
    });

    const combinedAudio = Buffer.concat(audioBuffers);

    return new Response(combinedAudio, {
      status: 200,
      headers: {
        "Content-Type": "audio/webm",
        "Content-Disposition": `inline; filename="${recording.id}.webm"`,
        "Content-Length": combinedAudio.length.toString(),
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or expired token",
      }),
      { status: 401 }
    );
  }
}
