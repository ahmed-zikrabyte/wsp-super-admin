"use client";

import {
  BarChart3,
  Building2,
  FileText,
  FolderTree,
  Gift,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Truck,
  User,
  UserCheck,
  UserCog,
  Users,
  Users2,
  Video,
} from "lucide-react";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        type: "dashboard",
      },
      {
        title: "Companies",
        url: "/companies",
        icon: Building2,
        type: "companies",
      },
      {
        title: "Company Admins",
        url: "/company-admins",
        icon: Users,
        type: "company-admins",
      },
      {
        title: "Brands",
        url: "/brands",
        icon: Tags,
        type: "brands",
      },
      {
        title: "Brand Admins",
        url: "/brand-admins",
        icon: UserCog,
        type: "brand-admins",
      },
      {
        title: "Stores",
        url: "/stores",
        icon: Store,
        type: "stores",
      },
      {
        title: "Store Managers",
        url: "/store-managers",
        icon: UserCheck,
        type: "store-managers",
      },
      {
        title: "Store Executives",
        url: "/store-executives",
        icon: User,
        type: "store-executives",
      },
      {
        title: "Categories",
        url: "/categories",
        icon: FolderTree,
        type: "categories",
      },
      {
        title: "Products",
        url: "/products",
        icon: Package,
        type: "products",
      },
      {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
        type: "orders",
      },
      {
        title: "Delivery Partners",
        url: "/delivery-partners",
        icon: Truck,
        type: "delivery-partners",
      },
      {
        title: "Users",
        url: "/users",
        icon: Users2,
        type: "users",
      },
      {
        title: "Revenue & Reports",
        url: "/reports",
        icon: BarChart3,
        type: "reports",
      },
      {
        title: "Video Calls & Chats",
        url: "/interactions",
        icon: Video,
        type: "interactions",
      },
      {
        title: "Promotions",
        url: "/promotions",
        icon: Gift,
        type: "promotions",
      },
      {
        title: "System Configs",
        url: "/settings",
        icon: Settings,
        type: "settings",
      },
      {
        title: "Audit Logs",
        url: "/logs",
        icon: FileText,
        type: "logs",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" flex items-center pl-4 bg-white text-xl font-extrabold">
        {state === "expanded" ? "WeSeeShop" : "W"}
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
