import ButtonWithIcon from "@/components/atom/ButtonWithIcon";

export default function PredictiveAnalyticsButton() {
  return (
    <ButtonWithIcon
      icon={"/analise-preditiva-icon.png"}
      altIcon={"analise preditiva"}
      text={"Análise preditiva"}
      buttonColor={"white"}
      colorHover={"blue"}
      textColor={"blue"}
    />
  );
}
