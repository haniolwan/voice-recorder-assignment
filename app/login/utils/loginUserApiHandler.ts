import { User } from "../page";

type LoginSuccess = {
  success: true;
  user: User;
  token: string;
};

type LoginFailure = {
  success: false;
  message: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

export const loginUserApiHandler = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
