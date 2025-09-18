"use client";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { EditIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { deleteBox, getBoxes } from "@/services/boxService";

interface Box {
  _id: string;
  label: string;
  length: number;
  breadth: number;
  height: number;
  boxWeight: number;
  itemCountRange: {
    min: number;
    max: number;
  };
}

const BoxTable = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 0,
  });
  const [boxId, setBoxId] = useState<string>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchBoxes = async () => {
    try {
      const response = await getBoxes();

      console.log({ response });
      setBoxes(response.data.boxes);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  };

  const hnadlePaginationChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDeleteBox = async () => {
    try {
      const response = await deleteBox(boxId);
      fetchBoxes();
      toast.success(response.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);
  const columns: ColumnDef<Box>[] = [
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => {
        return <div>{row.original.label}</div>;
      },
    },
    {
      accessorKey: "length",
      header: "Length (cm)",
      cell: ({ row }) => {
        return <div>{row.original.length}</div>;
      },
    },
    {
      accessorKey: "breadth",
      header: "Breadth (cm)",
      cell: ({ row }) => {
        return <div>{row.original.breadth}</div>;
      },
    },
    {
      accessorKey: "height",
      header: "Height (cm)",
      cell: ({ row }) => {
        return <div>{row.original.height}</div>;
      },
    },
    {
      accessorKey: "boxWeight",
      header: "Box Weight (g)",
      cell: ({ row }) => {
        return <div>{row.original.boxWeight}</div>;
      },
    },
    {
      accessorKey: "itemCountRange",
      header: "Item Count Range",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.itemCountRange.min} -{" "}
            {row.original.itemCountRange.max}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <Link href={`/boxes/edit/${row.original._id}?type=boxes`}>
              <Button variant="outline" className=" cursor-pointer text-white">
                <EditIcon className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button
              variant={"outline"}
              className="text-red-500 hover:text-red-400"
              onClick={() => {
                setOpen(true);
                setBoxId(row.original._id);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className=" space-y-4">
      <NavBar
        label="Boxes"
        button={
          <Link href="/boxes/create?type=boxes">
            <Button
              className="bg-black cursor-pointer text-white"
              variant="default"
            >
              Add Box
            </Button>
          </Link>
        }
      />

      <DataTable
        onPaginationChange={hnadlePaginationChange}
        columns={columns}
        pagination={pagination}
        data={boxes}
      />
      <ConfirmationModal
        title="Delete!"
        description="Are you sure you want to delete the box?"
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDeleteBox}
      />
    </div>
  );
};

export default BoxTable;
