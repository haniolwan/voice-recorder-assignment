import { NextRequest } from "next/server";
import { validateToken } from "../api/auth/helpers";

type RouteHandler = (
  req: AuthenticatedRequest,
  context?: any
) => Promise<Response>;

type AuthenticatedRequest = NextRequest & {
  user: any;
};

export function withAuth(handler: RouteHandler) {
  return async (req: NextRequest, context: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        {
          success: false,
          message: "Authorization header missing",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Token missing",
        },
        { status: 401 }
      );
    }

    try {
      const { user } = validateToken(token);

      if (!user) {
        return Response.json(
          {
            success: false,
            message: "Invalid token",
          },
          { status: 401 }
        );
      }

      (req as AuthenticatedRequest).user = user;

      return handler(req as AuthenticatedRequest, context);
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }
  };
}
