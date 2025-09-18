"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ContactDetailsModal } from "@/components/contact/contactdetails";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/nav-bar";
import { type Contact, getContacts } from "@/services/contactServices";

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 0,
    total: 0,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // Fetch contacts function
  const fetchContacts = async () => {
    try {
      setLoading(false);
      const response = await getContacts(
        searchParams.get("search") || "",
        Number(searchParams.get("page") || 1)
      );

      console.log("API Response:", response); // Debug log

      if (response.data) {
        setContacts(response.data.contacts || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          hasNextPage: response.data.pagination?.hasNextPage || false,
          hasPrevPage: response.data.pagination?.hasPrevPage || false,
          totalPages: response.data.pagination?.totalPages || 0,
          total: response.data.pagination?.total || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      // Reset to empty state on error
      setContacts([]);
      setPagination({
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalPages: 0,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts when search params change
  useEffect(() => {
    fetchContacts();
  }, [searchParams.get("page"), searchParams.get("search")]);

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400); // 👈 debounce delay (ms)

    return () => {
      clearTimeout(handler); // cleanup old timer if user types again
    };
  }, [searchValue, pathname, router, searchParams]);

  // Handle view contact details
  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDetailsModalOpen(true);
  };

  // Define table columns
  const columns: ColumnDef<Contact, any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-medium">{row.original.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-gray-500" />
            <div className="text-sm">{row.original.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-500" />
            <div className="text-sm">{row.original.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message Preview",
      cell: ({ row }) => {
        const message = row.original.message;
        const preview =
          message && message.length > 25
            ? `${message.substring(0, 25)}...`
            : message;
        return (
          <div className="text-sm text-gray-600 max-w-xs">
            {preview || "No message"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted On",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {moment(row.original.createdAt).format("DD-MM-YYYY HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewContact(contact)}
            className="cursor-pointer"
          >
            <EyeIcon className="h-4 w-4 text-blue-500" />
          </Button>
        );
      },
    },
  ];

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <NavBar
        filtersComponent={
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search contacts..."
              className="w-[300px]"
              defaultValue={searchParams.get("search") || ""}
              onChange={handleSearchChange}
            />
          </div>
        }
        label="Contacts"
      />

      {loading ? (
        <div className="flex justify-center items-center p-8 h-full">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={contacts}
          pagination={pagination}
          onPaginationChange={handlePageChange}
        />
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
        />
      )}
    </div>
  );
};

export default ContactsPage;
