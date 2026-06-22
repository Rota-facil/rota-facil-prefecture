import ButtonWithIcon from "@/components/atom/ButtonWithIcon";

export default function DailyReportButton() {
  return (
    <ButtonWithIcon
      icon={"/relatorio-diario-icon.png"}
      altIcon={"Relatório do dia"}
      text={"Relatório do dia"}
      buttonColor={"none"}
      colorHover={"gray"}
      textColor={"white"}
      borderColor={"white"}
    />
  );
}
