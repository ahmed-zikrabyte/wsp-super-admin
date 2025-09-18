"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/nav-bar";
import { getUsers } from "@/services/userService";

import type { User } from "@/typing";

const Page = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 0,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString()); // Update the page parameter

    // Use router.push to update the URL without reloading the page
    router.push(`${pathname}?${params.toString()}`);
  };
  const fetchUsers = async () => {
    try {
      const response = await getUsers(
        searchParams.get("search") || "",
        Number(searchParams.get("page") || 1)
      );

      console.log({ response }, "users");
      setUsers(response.data.data);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "Sl.No",
      header: "Sl.No",
      cell: ({ row }) => {
        return (
          <div>
            {(Number(searchParams.get("page")) - 1) * 10 + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original.name || "N/A"}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.email || "N/A"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.original.phone || "N/A"}</div>,
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => <StatusBadge status={row.original.status} />,
    // },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy"),
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <Switch
    //       onCheckedChange={async () => {
    //         const response = await toggleUserStatus(row.original._id);
    //         console.log({ response }, "response");
    //         fetchUsers();
    //       }}
    //       className={`cursor-pointer ${row.original.status === "active" ? "!bg-green-500" : "bg-gray-500"}`}
    //       checked={row.original.status === "active"}
    //     />
    //   ),
    // },
  ];
  const [users, setUsers] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    fetchUsers();
  }, [searchParams.get("search"), searchParams.get("page")]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        filtersComponent={
          <Input
            placeholder="Search by name, email or phone"
            value={searchParams.get("search") || ""}
            onChange={(e) => {
              const value = e.target.value;
              const params = new URLSearchParams(searchParams.toString());

              if (value.trim() === "") {
                params.delete("search"); // remove the param if input is empty
              } else {
                params.set("search", value); // otherwise set it
              }

              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        }
        label="Users"
      />
      <DataTable
        columns={columns}
        data={users}
        pagination={pagination}
        onPaginationChange={handlePageChange}
      />
    </div>
  );
};

export default Page;
