import { validateToken } from "../auth/helpers";
import { recordingsData } from "@/app/lib/recordings";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { success: false, message: "Auth header not available" },
      { status: 400 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const { user } = validateToken(token);

    const { audio, uniqueId } = await req.json();

    let NewRecord = recordingsData.find(
      rc => (rc.id === uniqueId && rc.userId) === user.id
    );

    if (!NewRecord) {
      NewRecord = {
        id: uniqueId,
        userId: user.id,
        audioData: [audio],
        title: "Untitled",
        duration: 0,
        type: "audio",
        createdAt: new Date().toISOString(),
      };
      recordingsData.push(NewRecord);
    } else {
      if (!Array.isArray(NewRecord.audioData)) {
        NewRecord.audioData = [];
      }
      NewRecord.audioData.push(audio);
    }

    return Response.json({
      success: true,
      message: "Audio has been saved",
      newRecording: recordingsData,
    });
  } catch (err: any) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
