import { usersData } from "@/app/lib/users";
import { validateToken } from "../helpers";

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
    const userFound = usersData.find(user => user.email === user.email);

    if (!userFound) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
