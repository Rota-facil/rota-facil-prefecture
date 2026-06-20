import { Button } from "@/components/ui/button";

type AuthModeSelectorProps = {
  mode: "login" | "register";
  onChange: (mode: "login" | "register") => void;
};

export default function AuthModeSelector(
  authModeSelectorProps: AuthModeSelectorProps,
) {
  return (
    <div className="flex rounded-full bg-slate-100 p-1">
      <Button
        className={
          authModeSelectorProps.mode === "login"
            ? "flex-1 rounded-full bg-white hover:bg-white text-black shadow"
            : "flex-1 rounded-full bg-slate-100 hover:bg-slate-100 text-black"
        }
        onClick={() => authModeSelectorProps.onChange("login")}
      >
        Entrar
      </Button>

      <Button
        className={
          authModeSelectorProps.mode === "login"
            ? "flex-1 rounded-full bg-slate-100 hover:bg-slate-100 text-black"
            : "flex-1 rounded-full bg-white hover:bg-white text-black shadow"
        }
        onClick={() => authModeSelectorProps.onChange("register")}
      >
        Criar conta
      </Button>
    </div>
  );
}
