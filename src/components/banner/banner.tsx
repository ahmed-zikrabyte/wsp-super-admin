"use client";
import { Edit, Trash, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import {
  createBanner,
  deleteBanner,
  getBanners,
  toggleBannerStatus,
  updateBanner,
} from "@/services/bannerService";

type Banner = {
  _id: string;
  image: {
    url: string;
    mimeType: string;
    publicKey: string;
  };
  isActive: boolean;
};

const BannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [openToggle, setOpenToggle] = useState(false);
  const [toggleBannerId, setToggleBannerId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchBanners = async (page = 1) => {
    try {
      const response = await getBanners(page, 10);
      setBanners(response.data.banners);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handlePageChange = (page: number) => {
    fetchBanners(page);
  };

  const handleToggleConfirm = async () => {
    if (!toggleBannerId) return;
    try {
      await toggleBannerStatus(toggleBannerId);
      toast.success("Banner status updated");
      fetchBanners(pagination.currentPage);
      setOpenToggle(false);
    } catch {
      toast.error("Failed to toggle banner status");
    }
  };

  const handleDelete = async () => {
    if (!selectedBannerId) return;
    try {
      await deleteBanner(selectedBannerId);
      toast.success("Banner deleted");
      setOpenDelete(false);
      fetchBanners(pagination.currentPage);
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleCreateOrUpdate = async (id?: string) => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      if (id) {
        await updateBanner(id, formData);
        toast.success("Banner updated successfully");
      } else {
        await createBanner(formData);
        toast.success("Banner created successfully");
      }
      setOpenCreate(false);
      clearFile();
      fetchBanners(pagination.currentPage);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const columns = [
    {
      accessorKey: "slNo",
      header: "Sl.No",
      cell: ({ row }: { row: { index: number; original: Banner } }) => {
        return <div>{(pagination.currentPage - 1) * 10 + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "image",
      header: () => <div className="text-left pl-8">Image</div>,
      cell: ({ row }: { row: { original: Banner } }) => (
        <img
          src={row.original.image.url}
          alt="banner"
          className="h-16 w-32 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: { row: { original: Banner } }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => {
            setToggleBannerId(row.original._id);
            setOpenToggle(true);
          }}
          className="bg-gray-300 data-[state=checked]:bg-green-500"
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Banner } }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedBannerId(row.original._id);
              setOpenDelete(true);
            }}
          >
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setOpenCreate(true);
              setSelectedBannerId(row.original._id);
              setFile(null); // reset
              setPreview(row.original.image.url);
            }}
          >
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <NavBar
        label="Banners"
        button={
          <Button
            className="bg-black text-white"
            onClick={() => {
              setOpenCreate(true);
              setSelectedBannerId(null);
              setFile(null);
              setPreview(null);
            }}
          >
            Add Banner
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={banners}
        pagination={pagination}
        onPaginationChange={handlePageChange}
      />

      {/* Delete */}
      {openDelete && (
        <ConfirmationModal
          open={openDelete}
          onOpenChange={setOpenDelete}
          onConfirm={handleDelete}
          title="Delete Banner"
          description="Are you sure you want to delete this banner?"
        />
      )}

      {/* Toggle */}
      {openToggle && (
        <ConfirmationModal
          open={openToggle}
          onOpenChange={setOpenToggle}
          onConfirm={handleToggleConfirm}
          title="Toggle Banner Status"
          description="Are you sure you want to change this banner status?"
        />
      )}

      {/* Create/Edit */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-md w-full rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedBannerId ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded p-2"
            />

            {preview && (
              <div className="relative w-full h-48 rounded overflow-hidden border border-gray-300">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-50"
                  onClick={clearFile}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="bg-black text-white w-full"
              disabled={!preview}
              onClick={() =>
                handleCreateOrUpdate(selectedBannerId || undefined)
              }
            >
              {selectedBannerId ? "Update" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerPage;
