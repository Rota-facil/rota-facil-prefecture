import SuperuserPrefectureDetailsPage from "@/components/organims/superuser/SuperuserPrefectureDetailsPage";

export default async function PrefectureDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SuperuserPrefectureDetailsPage prefectureId={id} />;
}
