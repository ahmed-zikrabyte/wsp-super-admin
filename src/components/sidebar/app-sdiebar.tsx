"use client";

import { Building2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: "Companies",
        url: "/companies",
        icon: Building2,
        type: "companies",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" flex items-start bg-white">
        <Image src="/images/logo.png" alt="logo" width={100} height={100} />
      </SidebarHeader>
      <SidebarContent className="!bg-white">
        <React.Suspense fallback={<div>Loading...</div>}>
          {" "}
          <NavMain items={data.navMain} />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
