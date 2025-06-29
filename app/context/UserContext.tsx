"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../login/page";

type UserData = {
  user: User;
  token: string | null;
};

type UserContextType = {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({ user: parsedUser, token });
      } catch (error) {
        setUserData(null);
      }
    }
  }, []);

  const isAuthenticated = !!userData?.token;

  return (
    <UserContext.Provider value={{ userData, setUserData, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
