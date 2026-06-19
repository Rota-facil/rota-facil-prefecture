import { Suspense } from "react";
import Oauth2CallBack from "@/components/oath2/Oauth2CallBack";

export default function Callback() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <Oauth2CallBack />
    </Suspense>
  );
}
