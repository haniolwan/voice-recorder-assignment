import { User } from "@/app/login/page";

type LoginSuccess = {
  success: true;
  token: string;
  user: User;
};

type LoginFailure = {
  success: false;
  message: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

export const registerUserApiHandler = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};
