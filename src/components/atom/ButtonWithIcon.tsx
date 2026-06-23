import Image from "next/image";
import Link from "next/link";

const typeButtons = {
  predictiveAnalytic: {
    description: "Análise preditiva",
    icon: "/analise-preditiva-icon.png",
    alt: "predictive analytic",
    style: "text-blue-500 hover:bg-blue-50/90 bg-white",
  },
  dailyReport: {
    description: "Relatório do dia",
    icon: "/relatorio-diario-icon.png",
    alt: "daily report",
    style: "hover:bg-gray-50/10 text-white",
  },
};

type TypeButtons = keyof typeof typeButtons;

type ButtonWithIconProps = {
  typeButton: TypeButtons;
};

export default function ButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <Link
      href={"#"}
      className={`inline-flex gap-1 justify-center items-center p-3 rounded-3xl h-10 text-primary cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground
      ${typeButtons[props.typeButton]["style"]}`}
    >
      <Image
        src={typeButtons[props.typeButton]["icon"]}
        alt={typeButtons[props.typeButton]["alt"]}
        width={30}
        height={30}
      />
      <p>{typeButtons[props.typeButton]["description"]}</p>
    </Link>
  );
}
