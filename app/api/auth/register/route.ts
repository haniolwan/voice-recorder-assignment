import { usersData } from "@/app/lib/users";
import { generateToken, hashPassword } from "./../helpers";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existingUser = usersData.find(user => user.email === email);

  if (existingUser) {
    return Response.json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: usersData.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  usersData.push(newUser);

  return Response.json({
    success: true,
    token: generateToken(newUser),
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
}
