import "../globals.css";
import AuthGuard from "@/components/molecules/login/AuthGuard";
import RoleAccessGuard from "@/components/molecules/login/RoleAccessGuard";
import { AppSidebar } from "@/components/organims/AppSideBar";
import PageHeader from "@/components/organims/PageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <UserProvider>
          <AppSidebar />

          <SidebarInset>
            <PageHeader />

            <RoleAccessGuard>
              <div className={"m-5"}>{children}</div>
            </RoleAccessGuard>
          </SidebarInset>
        </UserProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
