"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, EyeIcon } from "lucide-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/badges/custom-badge";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { ReviewDetailsModal } from "@/components/reviews/review-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import {
  approveReview,
  getReviews,
  toggleFeatured,
  toggleReviewStatus,
} from "@/services/reviewService";

interface Review {
  customerName: string;
  userId: {
    name: string;
    email: string;
  };
  product: {
    productId: string;
    name: string;
    images: {
      url: string;
    }[];
  };
  rating: number;
  review: string;
  status: string;
  createdAt: string;
  _id: string;
  approved?: boolean;
  isFeatured: boolean;
}
const Page = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const pathname = usePathname();

  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openReviewApproval, setOpenReviewApproval] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });
  const [openFeaturedModal, setOpenFeaturedModal] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  });
  const fetchReviews = async () => {
    try {
      const response = await getReviews(Number(searchParams.get("page")) || 1);

      console.log({ response }, "response");
      setReviews(response.data.reviews);
      setPagination({
        currentPage: response.data.currentPage,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [searchParams.get("search"), searchParams.get("page")]);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, []);

  const handlePaginationChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const columns: ColumnDef<Review, any>[] = [
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
      accessorKey: "userId.email",
      header: "Customer Email",
      cell: ({ row }) => {
        return <div>{row.original.userId.email}</div>;
      },
    },

    {
      accessorKey: "product.name",
      header: "Product Name",
      cell: ({ row }) => {
        return <div>{row.original.product.name}</div>;
      },
    },

    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        return (
          <div className="relative rounded-md overflow-hidden ">
            {row.original.rating}
          </div>
        );
      },
    },
    {
      accessorKey: "review",
      header: "Review",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.review.length > 20
              ? `${row.original.review.slice(0, 20)}...`
              : row.original.review}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div>
            {
              <StatusBadge
                status={
                  row.original.approved ? row.original.status : "not_approved"
                }
              />
            }
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return <div>{moment(row.original.createdAt).format("DD-MM-YYYY")}</div>;
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            {row.original.approved ? (
              <Switch
                onCheckedChange={async () => {
                  const response = await toggleReviewStatus(row.original._id);
                  console.log({ response }, "response");
                  fetchReviews();
                }}
                className={`cursor-pointer ${row.original.status === "visible" ? "!bg-green-500" : "bg-gray-500"}`}
                checked={row.original.status === "visible"}
              />
            ) : (
              <Button
                className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800"
                onClick={() =>
                  setOpenReviewApproval({ id: row.original._id, open: true })
                }
              >
                <CheckIcon /> Approve
              </Button>
            )}
            <Button
              variant="outline"
              className="cursor-pointer text-white"
              onClick={() => {
                setSelectedReview(row.original);
                setIsOpen(true);
              }}
            >
              <EyeIcon className="w-4 h-4 text-blue-500" />
            </Button>
            <ReviewDetailsModal
              review={selectedReview}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "Featured",
      header: "Featured",
      cell: ({ row }) => {
        return (
          <>
            {row.original.approved && (
              <Switch
                onCheckedChange={async () => {
                  setOpenFeaturedModal({ open: true, id: row.original._id });
                }}
                className={`cursor-pointer ${row.original.isFeatured === true ? "!bg-green-500" : "bg-gray-500"}`}
                checked={row.original.isFeatured}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar label="Reviews" />
      <DataTable
        columns={columns}
        onPaginationChange={handlePaginationChange}
        pagination={pagination}
        data={reviews}
      />
      <ConfirmationModal
        open={openReviewApproval.open}
        onOpenChange={(value) =>
          setOpenReviewApproval((prev) => ({ ...prev, open: value }))
        }
        title="Approve Review?"
        description="Checked the review? Are your sure you want to approve?"
        onConfirm={async () => {
          const response = await approveReview(openReviewApproval.id);
          if (response.success) {
            fetchReviews();
          }
        }}
      />
      <ConfirmationModal
        open={openFeaturedModal.open}
        onOpenChange={(value) =>
          setOpenFeaturedModal((prev) => ({ ...prev, open: value }))
        }
        title="Featured?"
        description="Are you sure you want to make this review featured?"
        onConfirm={async () => {
          const response = await toggleFeatured(openFeaturedModal.id);
          if (response.success) {
            fetchReviews();
          }
        }}
      />
    </div>
  );
};

export default Page;
