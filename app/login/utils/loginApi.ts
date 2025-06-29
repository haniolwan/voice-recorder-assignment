import { usersData } from "@/app/lib/users";
import bcrypt from "bcryptjs";
import { User } from "../page";

const generateToken = (userData: User) => {
  return btoa(
    JSON.stringify({
      email: userData.email,
      expireAt: Date.now() + 3600000,
    })
  );
};

const validateToken = (token: string) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.expireAt > Date.now() ? decoded : null;
  } catch {
    return null;
  }
};

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const loginUserApi = async (newUser: User) => {
  const user = usersData.find(user => user.email === newUser.email);

  if (user) {
    const passwordMatch = await comparePassword(
      newUser.password,
      user.password
    );

    if (passwordMatch) {
      return {
        success: true,
        token: generateToken(newUser),
        user: { id: user.id, name: user.name, email: user.email },
      };
    }
  }
  return { success: false, message: "Invalid credentials" };
};

export const registerUserApi = async (user: User) => {
  const existingUser = usersData.find(user => user.email === newUser.email);

  if (existingUser) {
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await hashPassword(user.password);

  const newUser = {
    id: usersData.length + 1,
    ...user,
    password: hashedPassword,
  };

  usersData.push(newUser);

  return {
    success: true,
    token: generateToken(newUser),
    user: { id: newUser.id, email: newUser.email },
  };
};
