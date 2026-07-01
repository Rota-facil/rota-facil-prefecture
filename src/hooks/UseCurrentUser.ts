"use client";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export function useCurrentUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useCurrentUser deve ser usado dentro de UserProvider");
  }

  return context;
}
