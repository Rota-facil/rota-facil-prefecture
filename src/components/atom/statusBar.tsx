const ballColors = {
  green: "bg-green-600",
  yellow: "bg-yellow-400",
  red: "bg-red-800",
};

const textColors = {
  white: "text-white",
  blue: "text-blue-500",
  black: "text-black",
};

type TextColors = keyof typeof textColors;
type BallColors = keyof typeof ballColors;

type StatusBarProps = {
  BallColor: BallColors;
  text?: string;
  textColor: TextColors;
  position: string;
};

export default function StatusBar(props: StatusBarProps) {
  return (
    <div
      className={`inline-flex ${props.position}  bg-white/15 items-center justify-center gap-2 font-medium rounded-2xl p-1 pl-3 pr-3`}
    >
      <div
        className={`${ballColors[props.BallColor ?? "green"]} w-2 rounded-4xl h-2 animate-pulse`}
      ></div>

      <p className={`${textColors[props.textColor ?? "white"]}`}>
        {props.text ?? "status"}
      </p>
    </div>
  );
}
