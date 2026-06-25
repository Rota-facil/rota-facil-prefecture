import "../globals.css";
import AuthGuard from "@/components/molecules/login/AuthGuard";
import { AppSidebar } from "@/components/organims/AppSideBar";
import PageHeader from "@/components/organims/PageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <PageHeader />

          <div className={"m-5 pt-14"}>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
