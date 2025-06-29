import { usersData } from "@/app/lib/users";
import { comparePassword, generateToken } from "./../helpers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = usersData.find(user => user.email === email);

  if (user) {
    const passwordMatch = await comparePassword(password, user.password);

    if (passwordMatch) {
      return Response.json({
        success: true,
        token: generateToken(email),
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  }
  return Response.json({ success: false, message: "Invalid credentials" });
}
