import { NextRequest } from "next/server";
import { recordingsData } from "@/app/lib/recordings";
import { withAuth } from "@/app/handler/withAuth";

async function playRecordHandler(
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

  const record = recordingsData?.find(rc => rc.id === params.id);
  try {
    if (!record) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Recording not found",
        }),
        { status: 404 }
      );
    }

    if (!Array.isArray(record.audioData)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Audio data is invalid",
        }),
        { status: 500 }
      );
    }

    const audioBuffers = record.audioData.map(base64Str => {
      const base64 = base64Str.split(",")[1];
      return Buffer.from(base64, "base64");
    });

    const combinedAudio = Buffer.concat(audioBuffers);

    return new Response(combinedAudio, {
      status: 200,
      headers: {
        "Content-Type": "audio/webm",
        "Content-Disposition": `inline; filename="${record.id}.webm"`,
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

export const POST = withAuth(playRecordHandler);
