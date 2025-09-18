"use client";

import {
  BoxIcon,
  Bus,
  ContactIcon,
  Group,
  Home,
  MessageCircle,
  MessageCircleQuestion,
  Settings2,
  Ticket,
  User,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useStatsStore } from "@/store/side.stats";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    products,
    categories,
    reviews,
    fetchStats,
    orders,
    coupons,
    users,
    boxes,
    contacts,
    banners,
    faqs,
  } = useStatsStore();

  React.useEffect(() => {
    fetchStats();
  }, []);
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard?type=dashboard",
        icon: Home,
        type: "dashboard",
      },
      {
        title: "Banners",
        url: "/banner",
        icon: Home,
        type: "banners",
        count: banners,
      },
      {
        title: "Categories",
        url: "/categories?type=categories&page=1",
        icon: Group,
        type: "categories",
        count: categories,
      },
      {
        title: "Products",
        url: "/products?type=products&page=1",
        icon: BoxIcon,
        type: "products",
        count: products,
      },
      {
        title: "Coupons",
        url: "/coupons?type=coupons&section=admin&page=1",
        icon: Ticket,
        type: "coupons",
        count: coupons,
      },
      {
        title: "Orders",
        url: "/orders?type=orders&page=1",
        icon: Bus,
        type: "orders",
        count: orders,
      },
      {
        title: "Reviews",
        url: "/reviews?type=reviews",
        icon: MessageCircle,
        type: "reviews",
        count: reviews,
      },
      {
        title: "Users",
        url: "/users?type=users",
        icon: User,
        type: "users",
        count: users,
      },
      {
        title: "Boxes",
        url: "/boxes?type=boxes",
        icon: BoxIcon,
        type: "boxes",
        count: boxes,
      },
      {
        title: "Contacts",
        url: "/contact",
        icon: ContactIcon,
        type: "contacts",
        count: contacts,
      },
      {
        title: "FAQs",
        url: "/faq",
        icon: MessageCircleQuestion,
        type: "faqs",
        count: faqs,
      },
      {
        title: "Config",
        url: "/config?type=config",
        icon: Settings2,
        type: "config",
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
