"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/badges/custom-badge";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import {
  deleteProduct,
  getProducts,
  toggleProductStatus,
} from "@/services/productService";
import type { Product } from "@/typing";

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 0,
  });
  const fetchProducts = async () => {
    try {
      const response = await getProducts(
        searchParams.get("search") || "",
        Number(searchParams.get("page") || 1)
      );

      console.log({ response }, "procuts");
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPrevPage: response.data.pagination.hasPrevPage,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  console.log({ pagination }, "pagination");
  useEffect(() => {
    fetchProducts();
  }, [searchParams.get("search"), searchParams.get("page")]);
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", search);

    if (search === "") {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const [open, setOpen] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [slug, setSlug] = useState("");
  const handleToggle = async () => {
    try {
      const response = await toggleProductStatus(slug);
      toast.success(response.message);
      fetchProducts();
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Failed to toggle product status"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProduct(slug);
      toast.success(response.message);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to delete product");
    }
  };
  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "Sl.No",
      header: "Sl.No",
      cell: ({ row }) => {
        return (
          <div>
            {(Number(searchParams.get("page") || 1) - 1) * 10 + row.index + 1}
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <div>{row.original.category.name}</div>;
      },
    },
    {
      accessorKey: "sortProduct",
      header: "Sort Product",
      cell: ({ row }) => {
        return <div>{row.original.sortProduct}</div>;
      },
    },
    {
      accessorKey: "variants",
      header: "Variants",
      cell: ({ row }) => {
        return <div>{row.original.variants.length}</div>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div>
            <StatusBadge status={row.original.status} />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.status === "in-stock";

        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <Switch
              className={`cursor-pointer ${
                isActive ? "!bg-green-500" : "bg-gray-500"
              }`}
              checked={isActive}
              onCheckedChange={() => {
                setSlug(row.original.slug);
                setOpen(true);
              }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/products/edit/${row.original.slug}?type=products`}>
              <Button
                size="icon"
                variant="outline"
                className=" cursor-pointer text-white"
              >
                <EditIcon className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Link href={`/products/view/${row.original.slug}?type=products`}>
              <Button
                size="icon"
                variant="outline"
                className=" cursor-pointer text-white"
              >
                <Eye className="w-4 h-4 text-blue-500" />
              </Button>
            </Link>
            <Button
              variant={"outline"}
              className="text-red-500"
              onClick={() => {
                setSlug(row.original.slug);
                setOpenDeleteConfirmModal(true);
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        label="Products"
        filtersComponent={
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search product name"
          />
        }
        button={
          <Link href="/products/create?type=products">
            <Button
              className="bg-black cursor-pointer text-white"
              variant="default"
            >
              Add Product
            </Button>
          </Link>
        }
      />
      <DataTable
        pagination={pagination}
        columns={columns}
        onPaginationChange={handlePageChange}
        data={products}
      />
      {open && (
        <ConfirmationModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={handleToggle}
          title="Toggle Product Status"
          description="Are you sure you want to toggle the product status?"
        />
      )}
      <ConfirmationModal
        open={openDeleteConfirmModal}
        onOpenChange={setOpenDeleteConfirmModal}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete the product?"
      />
    </div>
  );
};
export default Page;
