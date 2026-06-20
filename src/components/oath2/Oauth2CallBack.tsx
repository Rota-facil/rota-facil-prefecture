"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { saveToken } from "@/service/auth/TokenService";

export default function Oauth2CallBack() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = searchParams.get("token");

  useEffect(() => {
    if (accessToken === null) router.replace("/login");
    else {
      saveToken(accessToken);
      router.replace("/home");
    }
  }, [accessToken, router.replace]);

  return <p>Autenticando...</p>;
}
