"use client";

import Image from "next/image";
import Link from "next/link";
import { getGrafanaUrl } from "@/config/env";

const typeButtons = {
  predictiveAnalytic: {
    description: "Análise preditiva",
    icon: "/analise-preditiva-icon.png",
    alt: "predictive analytic",
    href: "/predictive-analysis",
    external: false,
    style: "hover:bg-blue-50/90 bg-white",
    textColor: "text-blue-500",
  },
  dailyReport: {
    description: "Observabilidade",
    icon: "/relatorio-diario-icon.png",
    alt: "observability",
    href: getGrafanaUrl,
    external: true,
    style: "hover:bg-gray-50/10 text-white",
    textColor: "text-white",
  },
};

type TypeButtons = keyof typeof typeButtons;

type ButtonWithIconProps = {
  typeButton: TypeButtons;
};

export default function ButtonWithIcon(props: ButtonWithIconProps) {
  const button = typeButtons[props.typeButton];
  const href = typeof button.href === "function" ? button.href() : button.href;

  return (
    <Link
      href={href}
      className={`inline-flex gap-1 justify-center items-center p-3 rounded-3xl h-10 text-primary cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground
      ${button.style}`}
      target={button.external ? "_self" : undefined}
    >
      <Image src={button.icon} alt={button.alt} width={30} height={30} />
      <p className={button.textColor}>{button.description}</p>
    </Link>
  );
}
