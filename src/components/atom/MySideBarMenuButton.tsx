"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

type MySideBarMenuButtonProps = {
  children: React.ReactNode;
  href: string;
};

export default function MySideBarMenuButton(props: MySideBarMenuButtonProps) {
  const router = useRouter();
  const usePathName = usePathname();
  const isActive = usePathName === props.href;

  return (
    <SidebarMenuButton
      isActive={isActive}
      className={`
        rounded-full
        font-medium
        cursor-pointer
        transition-all duration-200

        hover:bg-blue-50
        hover:text-blue-700

        ${isActive ? "bg-blue-50 text-blue-700" : "text-muted-foreground"}
    `}
      onClick={() => router.push(props.href)}
    >
      {props.children}
    </SidebarMenuButton>
  );
}
