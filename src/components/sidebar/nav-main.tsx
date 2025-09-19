"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    type: string;
    count?: number;
  }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const type = searchParams.get("type");

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // Check if current route matches this item
          let isActive = false;

          if (item.type === "companies") {
            isActive =
              pathname === "/companies" || pathname.startsWith("/companies");
          } else {
            isActive = type === item.type;
          }

          return (
            <Link href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`cursor-pointer py-5 ${
                    isActive
                      ? "!bg-black text-white hover:text-white font-medium"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
                  tooltip={item.title}
                >
                  {item.icon && (
                    <item.icon className={isActive ? "text-white" : ""} />
                  )}

                  {/* Wrap title and badge together */}
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.count !== undefined && item.count !== null && (
                      <SidebarMenuBadge
                        className={`text-xs ${
                          isActive
                            ? "bg-white text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.count}
                      </SidebarMenuBadge>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
