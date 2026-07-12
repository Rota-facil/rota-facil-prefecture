import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";

export type ReportType = "student-absences" | "cancelled-trips";

export async function downloadReport(
  type: ReportType,
  startDate: string,
  endDate: string,
): Promise<void> {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/reports/${type}?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao gerar relatório");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename =
    disposition?.match(/filename="?([^";]+)"?/)?.[1] ?? `${type}.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
