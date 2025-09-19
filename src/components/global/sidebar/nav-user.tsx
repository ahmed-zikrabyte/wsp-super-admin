// "use client";

// import { ChevronsUpDown, LogOut } from "lucide-react";
// import { useRouter } from "next/navigation";
// import CustomAlertDialog from "@/components/common/alert";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { useAuthStore } from "@/store/authStore";
// export function NavUser({
//   user,
// }: {
//   user: {
//     name: string;
//     email: string;
//     avatar: string;
//   };
// }) {
//   const { isMobile } = useSidebar();
//   // const { logout } = useAuthStore();
//   const router = useRouter();
//   const { email } = useAuthStore();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger className="cursor-pointer" asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <Avatar className="h-8 w-8 rounded-lg">
//                 <AvatarImage src={user.avatar} alt={"At-Work"} />
//                 <AvatarFallback className="rounded-lg">A</AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{"At-Work"}</span>
//                 <span className="truncate text-xs">{email}</span>
//               </div>
//               <ChevronsUpDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             onClick={(e) => e.preventDefault()}
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={user.avatar} alt={user.name} />
//                   <AvatarFallback className="rounded-lg">A</AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{"At-Work"}</span>
//                   <span className="truncate text-xs">{email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <CustomAlertDialog
//               trigger={
//                 <DropdownMenuItem
//                   className="cursor-pointer"
//                   onSelect={(e) => {
//                     e.preventDefault();
//                   }}
//                 >
//                   <LogOut />
//                   Log out
//                 </DropdownMenuItem>
//               }
//               onAction={() => {
//                 // logout();
//                 localStorage.removeItem("admin-token");
//                 router.push("/login");
//               }}
//               title="Confirm Logout"
//               description="Are you sure you want to log out?"
//               type="warning"
//             />
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
