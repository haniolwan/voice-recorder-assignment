import bcrypt from "bcryptjs";

export const generateToken = (email: string) => {
  return btoa(
    JSON.stringify({
      email,
      expireAt: Date.now() + 3600000,
    })
  );
};

export const validateToken = (token: string) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.expireAt > Date.now() ? decoded : null;
  } catch {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
