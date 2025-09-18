"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/badges/custom-badge";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import {
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
} from "@/services/categoryService";

interface Category {
  name: string;
  slug: string;
  image: string;
  createdAt: string;
}
const Page = () => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  const handleToggle = async () => {
    try {
      const response = await toggleCategoryStatus(slug as string);
      toast.success(response.message);
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Failed to toggle category status"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(slug as string);
      toast.success(response.message);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to delete category");
    }
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const columns: ColumnDef<any, any>[] = [
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
      cell: ({ row }) => {
        return <div>{row.original.name}</div>;
      },
    },

    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.image?.url;

        return (
          <div className="w-14 h-14 relative rounded-md overflow-hidden border">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        );
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
        const isActive = row.original.status === "active";

        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <Switch
              className={`cursor-pointer ${isActive ? "!bg-green-500" : "bg-gray-500"}`}
              checked={isActive}
              onCheckedChange={() => {
                setSlug(row.original.slug);
                setOpen(true);
              }}
            />
            <Link href={`/categories/edit/${row.original.slug}`}>
              <Button variant="outline" className=" cursor-pointer text-white">
                <EditIcon className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => {
                setSlug(row.original.slug);
                setOpenDeleteConfirmModal(true);
              }}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        label="Categories"
        button={
          <Link href="/categories/create?type=categories">
            <Button
              className="bg-black cursor-pointer text-white"
              variant="default"
            >
              Add Category
            </Button>
          </Link>
        }
      />
      <DataTable columns={columns} data={categories} />
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleToggle}
        title="Toggle Category Status"
        description="Are you sure you want to toggle the category status?"
      />
      <ConfirmationModal
        open={openDeleteConfirmModal}
        onOpenChange={setOpenDeleteConfirmModal}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete the category?"
      />
    </div>
  );
};

export default Page;
