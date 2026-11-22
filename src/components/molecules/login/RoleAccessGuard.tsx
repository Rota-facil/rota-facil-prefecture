"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/UseCurrentUser";

const superuserRoutes = ["/superuser", "/prefecture-applications", "/audit"];
const sharedRoutes = ["/profile"];

function startsWithRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function RoleAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const isSuperuserRoute = superuserRoutes.some((route) =>
    startsWithRoute(pathname, route),
  );
  const isSharedRoute = sharedRoutes.some((route) =>
    startsWithRoute(pathname, route),
  );

  useEffect(() => {
    if (loading || !user?.role) return;

    if (user.role === "SUPERUSER" && !isSuperuserRoute && !isSharedRoute) {
      router.replace("/superuser");
      return;
    }

    if (user.role !== "SUPERUSER" && isSuperuserRoute) {
      router.replace("/home");
    }
  }, [isSharedRoute, isSuperuserRoute, loading, router, user?.role]);

  if (
    loading ||
    (user?.role === "SUPERUSER" && !isSuperuserRoute && !isSharedRoute)
  ) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
      </div>
    );
  }

  return <>{children}</>;
}
