export const verifyUserApiHandler = async (token: string) => {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return Response.json({ success: true, message: "Token verified" });
    }
  } catch (error) {
    return Response.json({ success: false, message: "Network error" });
  }
};
