import Image from "next/image";
import { Button } from "@/components/ui/button.tsx"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center  " >
       <p>Hello world Rota Fácil</p>
       <Button>Click me</Button>
    </div>
);
}
