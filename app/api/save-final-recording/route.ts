import { recordingsData } from "@/app/lib/recordings";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

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
