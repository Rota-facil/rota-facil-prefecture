import PrefectureApplicationDetailsPage from "@/components/organims/prefecture-applications/PrefectureApplicationDetailsPage";

export default async function ApplicationDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PrefectureApplicationDetailsPage applicationId={id} />;
}
