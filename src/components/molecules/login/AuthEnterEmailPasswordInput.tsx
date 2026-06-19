import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmailPasswordValue = {
  email: string;
  setEmail: (email: string) => void;

  password: string;
  setPassword: (password: string) => void;

  handlerLogin: () => void;

  errorMessage: string;
};

export default function AuthEnterEmailPasswordInput(
  emailPasswordValue: EmailPasswordValue,
) {
  return (
    <div className="space-y-4 mt-3">
      <Input
        type="email"
        required={true}
        placeholder="Email"
        className="h-12 rounded-2xl"
        value={emailPasswordValue.email}
        onChange={(e) => emailPasswordValue.setEmail(e.target.value)}
      />

      <Input
        type="password"
        required={true}
        placeholder="Senha"
        className="h-12 rounded-2xl"
        value={emailPasswordValue.password}
        onChange={(e) => emailPasswordValue.setPassword(e.target.value)}
      />

      {emailPasswordValue.errorMessage && (
        <p className="text-red-700 text-sm text-center">
          {emailPasswordValue.errorMessage}
        </p>
      )}
      <Button
        className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        onClick={() => emailPasswordValue.handlerLogin()}
      >
        Entrar
      </Button>
    </div>
  );
}
