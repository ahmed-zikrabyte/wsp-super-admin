"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FAQModal from "@/components/faq/faqModal";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import { deleteFaq, getFaqs, toggleFaqStatus } from "@/services/faqService";

interface IFaq {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

const page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [faqs, setFaqs] = useState<IFaq[] | null>(null);
  const router = useRouter();
  const [faqId, setFaqId] = useState("");
  const [faqDataView, setFaqDataView] = useState({ question: "", answer: "" });
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFaqModal, setOpenFaqModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  });

  const handlePaginationChange = (page: number) => {
    console.log(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const fetchFaqs = async () => {
    const response = await getFaqs();
    console.log(response.data);
    setFaqs(response.data.data);
    console.log(response.data.pagination);
    setPagination({
      currentPage: response.data.pagination.page,
      total: response.data.pagination.total,
      hasNextPage: response.data.pagination.hasNextPage,
      hasPrevPage: response.data.pagination.hasPrevPage,
      totalPages: response.data.pagination.totalPages,
    });
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleToggleStatus = async () => {
    const response = await toggleFaqStatus(faqId);
    if (response.success) {
      toast.success(response.message);
      fetchFaqs();
    } else {
      toast.error(response.message);
    }
  };

  const handleDelete = async () => {
    const response = await deleteFaq(faqId);
    if (response.success) {
      toast.success(response.message);
      fetchFaqs();
    } else {
      toast.error(response.message);
    }
  };

  const columns: ColumnDef<IFaq, any>[] = [
    {
      accessorKey: "Sl.No",
      header: "Sl.No",
      cell: ({ row }) => {
        return <div>{(pagination.currentPage - 1) * 10 + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "Question",
      header: "Question",
      cell: ({ row }) => {
        const text = row.original.question;
        return (
          <div>{text.length > 35 ? `${text.substring(0, 35)}...` : text}</div>
        );
      },
    },
    {
      accessorKey: "Answer",
      header: "Answer",
      cell: ({ row }) => {
        const text = row.original.answer;
        return (
          <div>{text.length > 35 ? `${text.substring(0, 35)}...` : text}</div>
        );
      },
    },

    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div>
            <Switch
              className={`${row.original.isActive ? "!bg-green-500" : "bg-gray-400"}`}
              checked={row.original.isActive}
              onCheckedChange={() => {
                setFaqId(row.original._id);
                setOpen(true);
              }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "Action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="space-x-2">
            <Button
              variant={"outline"}
              onClick={() => {
                setFaqDataView({
                  question: row.original.question,
                  answer: row.original.answer,
                });
                setOpenFaqModal(true);
              }}
            >
              <Eye />
            </Button>
            <Link href={`/faq/edit/${row.original._id}`}>
              <Button variant={"outline"}>
                <Edit className="text-blue-400" />
              </Button>
            </Link>
            <Button
              variant={"outline"}
              onClick={() => {
                setFaqId(row.original._id);
                setOpenDeleteDialog(true);
              }}
            >
              <Trash className="text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (!faqs) {
    return <div>Loading....</div>;
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        label="FAQs"
        button={
          <Button
            className="bg-black text-white hover:bg-black/90 duration-150"
            onClick={() => router.push("/faq/create")}
          >
            Add new Question
          </Button>
        }
      />
      <DataTable
        onPaginationChange={handlePaginationChange}
        columns={columns}
        data={faqs}
      />
      <ConfirmationModal
        title="Toggle FAQ status"
        description="Are you sure you want to update status?"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => handleToggleStatus()}
      />
      <ConfirmationModal
        title="Delete FAQ"
        description="Are you sure you want to delete?"
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={() => handleDelete()}
      />
      <FAQModal
        open={openFaqModal}
        onOpenChange={setOpenFaqModal}
        data={faqDataView}
      />
    </div>
  );
};

export default page;
