import { withAuth } from "@/app/handler/withAuth";
import { recordingsData } from "@/app/lib/recordings";

async function getRecordsHandler(req: Request & { user: any }) {
  const { user } = req;
  try {
    const recordings = recordingsData.filter(
      rec => Number(rec.userId) === Number(user.id)
    );

    return Response.json({
      success: true,
      recordings,
      message: "Recordings fetched successfully",
    });
  } catch (err) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const GET = withAuth(getRecordsHandler);
