"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser } from "@/service/UserService";
import type { UserEntity } from "@/types/entites/UserEntity";

type UserContextType = {
  user: UserEntity | null;
  loading: boolean;
  error: Error | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
