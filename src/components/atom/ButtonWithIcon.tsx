import Image from "next/image";
import Link from "next/link";

const textColor = {
  white: "text-white",
  blue: "text-blue-500",
  black: "text-black",
};

const buttonColor = {
  white: "bg-white",
  none: "",
};

const colorHover = {
  blue: "hover:bg-blue-50/90",
  gray: "hover:bg-gray-50/10",
};

const borderColor = {
  white: "bg-white-300",
  none: "",
};

type TextColors = keyof typeof textColor;
type ButtonColors = keyof typeof buttonColor;
type ColorsHover = keyof typeof colorHover;
type BorderColors = keyof typeof borderColor;

type ButtonWithIconProps = {
  href?: string;
  icon: string;
  altIcon: string;
  text: string;
  textColor?: TextColors;
  buttonColor?: ButtonColors;
  colorHover?: ColorsHover;
  borderColor?: BorderColors;
};

export default function ButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <Link
      href={props.href ?? "#"}
      className={`inline-flex gap-1 justify-center items-center p-3 rounded-3xl h-10 text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground 
        ${buttonColor[props.buttonColor ?? "white"]} ${colorHover[props.colorHover ?? "blue"]} ${borderColor[props.borderColor ?? "none"]}`}
    >
      <Image src={props.icon} alt={props.altIcon} width={30} height={30} />
      <p className={`${textColor[props.textColor ?? "black"]} `}>
        {props.text}
      </p>
    </Link>
  );
}
