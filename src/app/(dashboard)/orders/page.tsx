"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import {
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  MoreVertical,
} from "lucide-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/badges/custom-badge";
import { OrderDetailsModal } from "@/components/orders/orders-details-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/nav-bar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  assignAWB,
  exportOrders,
  generateShiprocketDocument,
  getOrders,
  requestPickup,
} from "@/services/orderService";
import type { Order } from "@/typing";

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(false);
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false);
  const [selectedPickupDate, setSelectedPickupDate] = useState<
    Date | undefined
  >();
  const [currentOrderForPickup, setCurrentOrderForPickup] =
    useState<Order | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 0,
  });
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchOrders = async () => {
    try {
      const response = await getOrders(
        fromDate ? format(fromDate, "yyyy-MM-dd") : "",
        toDate ? format(toDate, "yyyy-MM-dd") : "",
        searchParams.get("search") || "",
        Number(searchParams.get("page") || 1)
      );
      console.log(response, "orders");
      setOrders(response.data.orders);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally set an error state here
    }
  };

  const handleExportOrders = async () => {
    try {
      const response = await exportOrders();
      fileDownload(response, "orders.xlsx");
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

  // Initialize dates from URL params on component mount
  useEffect(() => {
    const fromDateParam = searchParams.get("fromDate");
    const toDateParam = searchParams.get("toDate");

    if (fromDateParam && !fromDate) {
      setFromDate(new Date(fromDateParam));
    }
    if (toDateParam && !toDate) {
      setToDate(new Date(toDateParam));
    }
  }, []);

  // Fetch orders when dates or search params change
  useEffect(() => {
    fetchOrders();
  }, [
    searchParams.get("page"),
    searchParams.get("search"),
    searchParams.get("fromDate"), // Add fromDate as dependency
    searchParams.get("toDate"), // Add toDate as dependency
  ]);

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      params.set("type", "orders");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Handle date changes and update URL
  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (!date) {
      setToDate(undefined); // Reset to date if from date is cleared
    }

    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set("fromDate", date.toISOString().split("T")[0]);
    } else {
      console.log("else");
      params.delete("fromDate");
      params.delete("toDate");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);

    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set("toDate", date.toISOString().split("T")[0]);
    } else {
      params.delete("toDate");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClearDates = () => {
    setFromDate(undefined);
    setToDate(undefined);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("fromDate");
    params.delete("toDate");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle pickup request with date
  const handleRequestPickup = (order: Order) => {
    setCurrentOrderForPickup(order);
    setSelectedPickupDate(undefined);
    setPickupDialogOpen(true);
  };

  const handleConfirmPickup = async () => {
    if (!selectedPickupDate || !currentOrderForPickup) {
      alert("Please select a pickup date");
      return;
    }

    try {
      // Here you would call your pickup request API with the selected date
      // For example: await requestPickup(currentOrderForPickup.id, selectedPickupDate);
      setLoading(true);

      const responseOfRequestPickup = await requestPickup(
        currentOrderForPickup,
        new Date(
          selectedPickupDate.getTime() -
            selectedPickupDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      );

      toast.success(responseOfRequestPickup.data.message);

      console.log({ responseOfRequestPickup });

      Promise.all([
        generateShiprocketDocument(currentOrderForPickup, "manifest"),
        generateShiprocketDocument(currentOrderForPickup, "invoice"),
        generateShiprocketDocument(currentOrderForPickup, "label"),
      ]);

      // Close dialog and reset state
      setPickupDialogOpen(false);
      setSelectedPickupDate(undefined);
      setCurrentOrderForPickup(null);
      setLoading(false);
      // Optionally refresh orders
      fetchOrders();
    } catch (error: any) {
      setLoading(false);
      console.error("Error requesting pickup:", error);
      toast.error(error?.response?.data?.message || "Error requesting pickup");
    }
  };

  console.log({ orders });
  const columns: ColumnDef<Order, any>[] = [
    {
      accessorKey: "S_NO",
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
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => {
        return <div>{row.original.orderId}</div>;
      },
    },

    {
      accessorKey: "shipment.awbCode",
      header: "AWB Code",
      cell: ({ row }) => {
        return <div>{`#${row.original.shipment?.awbCode || "N/A"}`}</div>;
      },
    },
    {
      accessorKey: "address.fullName",
      header: "Name",
      cell: ({ row }) => {
        return <div>{row.original.address?.fullName || "N/A"}</div>;
      },
    },
    {
      accessorKey: "userId.email",
      header: "Email",
      cell: ({ row }) => {
        return <div>{row.original.userId?.email || "N/A"}</div>;
      },
    },
    {
      accessorKey: "address.phone",
      header: "Phone",
      cell: ({ row }) => {
        return <div>{row.original.address?.phone || "N/A"}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ordered On",
      cell: ({ row }) => {
        return <div>{moment(row.original.createdAt).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      accessorKey: "shipment.courierName",
      header: "Courier Name",
      cell: ({ row }) => {
        return <div>{row.original.shipment?.courierName || "N/A"}</div>;
      },
    },
    {
      accessorKey: "shipment.courierCompanyId",
      header: "Courier Company ID",
      cell: ({ row }) => {
        return <div>{row.original.shipment?.courierCompanyId || "N/A"}</div>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.original.status} />;
      },
    },

    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* View Order Button */}
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen(true);
                setOrder(order);
              }}
            >
              <EyeIcon className="h-4 w-4 text-blue-500" />
            </Button>

            {/* Dropdown for Shiprocket Actions */}

            {order.status === "confirmed" &&
              (order.shipment?.awbCode ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRequestPickup(order)}
                    >
                      Request For Pickup
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        assignAWB(
                          order.shipment.shipmentId,
                          order.shipment.courierCompanyId
                        )
                      }
                    >
                      Assign AWB
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </div>
        );
      },
    },
  ];

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString()); // Update the page parameter

    // Use router.push to update the URL without reloading the page
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        downloadTemplateButton={
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleExportOrders()}
          >
            <DownloadIcon className="mr-2 h-4 w-4 cursor-pointer" />
            Export
          </Button>
        }
        filtersComponent={
          <div className="flex flex-wrap items-end gap-4">
            {/* From Date */}
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[150px] justify-start text-left cursor-pointer text-xs flex items-center gap-0",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[100]  top-10"
                  align="end"
                  side="bottom"
                  sideOffset={4}
                  avoidCollisions={true}
                  collisionPadding={10}
                >
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date + Clear */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <Popover>
                  <PopoverTrigger className="cursor-pointer" asChild>
                    <Button
                      disabled={!fromDate}
                      variant="outline"
                      className={cn(
                        "w-[150px] justify-start text-left text-xs flex items-center gap-0",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[100]"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={true}
                    collisionPadding={10}
                  >
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={handleToDateChange}
                      initialFocus
                      disabled={(date) => (fromDate ? date < fromDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear Button for Both Dates */}
              {(fromDate || toDate) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-xs p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleClearDates}
                  title="Clear Dates"
                >
                  ×
                </Button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <Input
                placeholder="Search..."
                className="w-[200px]"
                defaultValue={searchParams.get("search") || ""}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        }
        label="Orders"
      />

      <DataTable
        columns={columns}
        data={orders}
        pagination={pagination}
        onPaginationChange={handlePageChange}
      />

      {/* Order Details Modal */}
      {order && (
        <OrderDetailsModal
          order={order as any}
          open={open}
          onOpenChange={setOpen}
        />
      )}

      {/* Pickup Date Selection Dialog */}
      <Dialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Request For Pickup</DialogTitle>
            <DialogDescription>
              Select a pickup date for order {currentOrderForPickup?.orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-sm font-medium">Pickup Date</h2>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !selectedPickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedPickupDate
                        ? format(selectedPickupDate, "PPP")
                        : "Select pickup date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[200] relative top-20"
                    align="center"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={true}
                    collisionPadding={10}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedPickupDate}
                      onSelect={setSelectedPickupDate}
                      initialFocus
                      disabled={(date) => date < tomorrow}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">
                Pickup date must be at least 1 day from today
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPickupDialogOpen(false);
                setSelectedPickupDate(undefined);
                setCurrentOrderForPickup(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPickup}
              disabled={!selectedPickupDate || loading}
            >
              {loading ? "Requesting..." : "Confirm Pickup Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
