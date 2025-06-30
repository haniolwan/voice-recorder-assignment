import { withAuth } from "@/app/handler/withAuth";
import { validateToken } from "../auth/helpers";
import { recordingsData } from "@/app/lib/recordings";

async function audioChunkHandler(req: Request & { user: any }) {
  try {
    const { user } = req;

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

export const POST = withAuth(audioChunkHandler);
