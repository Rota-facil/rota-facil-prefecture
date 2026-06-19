import Image from "next/image";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";

type GoogleLoginButtonProps = {
  className?: string;
};

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  return (
    <Button
      className={props.className}
      onClick={() => {
        window.location.href =
          env.GOOGLE_LOGIN_PREFECTURE_URL !== undefined
            ? env.GOOGLE_LOGIN_PREFECTURE_URL
            : "";
      }}
    >
      <Image
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-6"
        width={6}
        height={5}
      />

      <span className="font-medium">continuar com google</span>
    </Button>
  );
}
