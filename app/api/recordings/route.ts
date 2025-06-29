import { usersData } from "@/app/lib/users";
import { validateToken } from "../auth/helpers";
import { recordingsData } from "@/app/lib/recordings";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { success: false, message: "Auth header not available" },
      { status: 400 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = validateToken(token);

    const recordings = recordingsData.filter(
      rec => rec.userId !== Number(decoded.id)
    );

    return Response.json({
      success: true,
      recordings: [decoded],
      message: "Recordings fetched successfully",
    });
  } catch (err) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
