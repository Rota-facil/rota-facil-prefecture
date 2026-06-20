"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleLoginButton from "@/components/atom/GoogleLoginButton";
import RotaFacilLogo from "@/components/atom/Logo Rota-Facil.png";
import AuthEnterEmailPasswordInput from "@/components/molecules/login/AuthEnterEmailPasswordInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/auth/UseAuth";
import { login } from "@/service/auth/loginService";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();

  async function handlerLogin() {
    setErrorMessage("");
    try {
      const response = await login({ email, password });
      console.log(response);
      localStorage.setItem("access_token", response.accessToken);

      auth.login(response.accessToken);

      router.push("/home");
    } catch (_error) {
      setErrorMessage("Email ou senha incorretos");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-lg rounded-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold tracking-tight flex justify-center items-center flex-col gap-3 ">
            <Image src={RotaFacilLogo} alt="rota-facil" width="100" />
            Rota Fácil
          </CardTitle>

          <CardDescription className="text-base text-slate-500">
            Painel administrativo do transporte escolar municipal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <GoogleLoginButton
            className={
              "flex gap-3 w-full h-10 bg-[#f0f0f0] text-black hover:bg-slate-200 cursor-pointer"
            }
          />

          <AuthEnterEmailPasswordInput
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handlerLogin={handlerLogin}
            errorMessage={errorMessage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
