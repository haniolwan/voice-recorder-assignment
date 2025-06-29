import { usersData } from "@/app/lib/users";
import { validateToken } from "../auth/helpers";
import { audioData } from "@/app/lib/audio";

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
    const decoded = validateToken(token);
    const user = usersData.find(user => user.email === decoded.email);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    const audio = await req.json();

    audioData.push({
      id: Date.now().toString(),
      userId: user.id,
      ...audio,
    });

    return Response.json({
      success: true,
      message: "Audio has been saved",
    });
  } catch (err) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
