"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const isAuthenticated = !!user?.token;

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
