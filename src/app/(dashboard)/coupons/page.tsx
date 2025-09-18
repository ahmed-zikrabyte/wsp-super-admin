"use client";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/badges/custom-badge";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/ui/nav-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAdminCoupons,
  getCoupons,
  toggleCouponStatus,
} from "@/services/couponService";

interface Coupon {
  code: string;
  discountValue: number;
  minPurchaseAmount: number;
  startDate: string;
  expiresAt: string;
  status: string;
  slug: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
}

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", tab);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };
  const hanldePaginationChange = (page: number) => {
    console.log(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  });

  const [adminPagination, setAdminPagination] = useState({
    currentPage: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  });

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons(
        Number(searchParams.get("page")) || 1,
        filterStatus
      );
      console.log({ response }, "coupons");
      setCoupons(response.data.data);
      setPagination({
        currentPage: response.data.pagination.page,
        total: response.data.pagination.total,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const fetchAdminCoupons = async () => {
    try {
      const response = await getAdminCoupons(
        Number(searchParams.get("page")) || 1,
        filterStatus
      );
      console.log({ filterStatus });
      console.log({ response }, "admin-coupons");
      setAdminCoupons(response.data.data);

      setAdminPagination({
        currentPage: response.data.pagination.page,
        total: response.data.pagination.total,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchAdminCoupons();
  }, [searchParams.get("section"), searchParams.get("page"), filterStatus]);

  const userCoupon: ColumnDef<Coupon>[] = [
    {
      accessorKey: "Sl.No",
      header: "Sl.No",
      cell: ({ row }) => {
        return <div>{(pagination.currentPage - 1) * 10 + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => {
        return <div>{row.original.code}</div>;
      },
    },

    {
      accessorKey: "user.name",
      header: "User Name",
      cell: ({ row }) => {
        return <div>{row.original.userId?.name}</div>;
      },
    },
    {
      accessorKey: "discountValue",
      header: "Discount Value",
      cell: ({ row }) => {
        return <div>{row.original.discountValue}</div>;
      },
    },
    {
      accessorKey: "minPurchaseAmount",
      header: "Min Purchase Amount",
      cell: ({ row }) => {
        return <div>{row.original.minPurchaseAmount}</div>;
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        return <div>{moment(row.original.startDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires At",
      cell: ({ row }) => {
        return <div>{moment(row.original.expiresAt).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <div>{<StatusBadge status={row.original.status} />}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <Switch
              onCheckedChange={() => {
                setSelectedCouponCode(row.original.code);
                setOpen(true);
              }}
              className={`cursor-pointer ${row.original.status === "active" ? "!bg-green-500" : "bg-gray-500"}`}
              checked={row.original.status === "active"}
            />
            <Link href={`/coupons/edit/${row.original.slug}?type=coupons`}>
              <Button variant="outline" className=" cursor-pointer text-white">
                <EditIcon className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
  const columns: ColumnDef<Coupon, any>[] = [
    {
      accessorKey: "Sl.No",
      header: "Sl.No",
      cell: ({ row }) => {
        return (
          <div>{(adminPagination.currentPage - 1) * 10 + row.index + 1}</div>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => {
        return <div>{row.original.code}</div>;
      },
    },

    {
      accessorKey: "discountValue",
      header: "Discount Value",
      cell: ({ row }) => {
        return (
          <div className="relative rounded-md overflow-hidden ">
            {row.original.discountValue}
          </div>
        );
      },
    },
    {
      accessorKey: "minPurchaseAmount",
      header: "Min Purchase Amount",
      cell: ({ row }) => {
        return <div>{row.original.minPurchaseAmount}</div>;
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        return <div>{moment(row.original.startDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires At",
      cell: ({ row }) => {
        return <div>{moment(row.original.expiresAt).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <div>{<StatusBadge status={row.original.status} />}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <Switch
              onCheckedChange={() => {
                setSelectedCouponCode(row.original.code);
                setOpen(true);
              }}
              className={`cursor-pointer ${row.original.status === "active" ? "!bg-green-500" : "bg-gray-500"}`}
              checked={row.original.status === "active"}
            />
            <Link href={`/coupons/edit/${row.original.slug}?type=coupons`}>
              <Button variant="outline" className=" cursor-pointer text-white">
                <EditIcon className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const tabsItems = [
    {
      value: "admin",
      label: "Admin Coupons",
      content: (
        <DataTable
          onPaginationChange={hanldePaginationChange}
          pagination={adminPagination}
          columns={columns}
          data={adminCoupons}
        />
      ),
    },
    {
      value: "user",
      label: "User Coupons",
      content: (
        <DataTable
          onPaginationChange={hanldePaginationChange}
          pagination={pagination}
          columns={userCoupon}
          data={coupons}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        label="Coupons"
        filtersComponent={
          <div className="flex items-center space-x-2">
            <Label className="font-medium text-gray-700">Status Filter: </Label>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        button={
          searchParams.get("section") === "admin" && (
            <Link href="/coupons/create?type=coupons">
              <Button
                className="bg-black cursor-pointer text-white mr-4"
                variant="default"
              >
                Add Coupons
              </Button>
            </Link>
          )
        }
      />

      {/* underline tabs full-width */}

      <Tabs
        defaultValue={searchParams.get("section") || "admin"}
        onValueChange={handleTabChange}
        className="relative mr-auto   flex flex-col gap-4  w-full"
      >
        <TabsList className=" justify-start rounded-none border-b bg-transparent p-0">
          {tabsItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="relative cursor-pointer rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {item.label}{" "}
              <Badge variant={"secondary"}>
                {item.value === "admin"
                  ? adminPagination.total
                  : pagination.total}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsItems.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
      {selectedCouponCode && (
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() =>
            toggleCouponStatus(selectedCouponCode).then(() => {
              fetchCoupons();
              fetchAdminCoupons();
            })
          }
          title="Toggle Coupon Status"
          description="Are you sure you want to change the status?"
        />
      )}
    </div>
  );
};

export default Page;
