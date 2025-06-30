import { withAuth } from "@/app/handler/withAuth";
import { recordingsData } from "@/app/lib/recordings";
import { NextRequest, NextResponse } from "next/server";

async function saveFinalRecordHandler(req: NextRequest) {
  const body = await req.json();
  const { uniqueId } = body;

  if (!uniqueId) {
    return NextResponse.json(
      { success: false, message: "Missing recording ID" },
      { status: 400 }
    );
  }

  const newRecording = {
    id: uniqueId,
    title: `Recording - ${new Date().toLocaleTimeString()}`,
    createdAt: new Date().toISOString(),
    duration: Math.floor(Math.random() * 30) + 5,
    userId: body.userId,
    audioData: body.audioData,
    type: body.type,
  };

  recordingsData.push(newRecording);

  return NextResponse.json({ success: true, newRecording }, { status: 200 });
}

export const POST = withAuth(saveFinalRecordHandler);
