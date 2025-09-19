"use client";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Key,
  MoreHorizontal,
  Plus,
  Power,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
// import { ConfirmationModal } from "@/components/global/confirmation-modal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CompanyAdminModal from "@/components/companies/company-admin-modal";
import CompanyModal from "@/components/companies/company-modal";
import PasswordResetModal from "@/components/companies/password-reset-modal";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteCompany,
  deleteCompanyAdmin,
  getCompanies,
  getCompanyAdmins,
  toggleCompanyAdminStatus,
  toggleCompanyStatus,
} from "@/services/superAdminService";
import type { Company, CompanyAdmin } from "@/types/superAdmin.types";

export default function CompaniesPage() {
  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyAdmins, setCompanyAdmins] = useState<CompanyAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<CompanyAdmin | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getCompanies(currentPage, 10, searchTerm);
      setCompanies(response.data.items);
      setTotalPages(response.data.pagination.totalPages);
    } catch (_error) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyAdmins = async () => {
    setLoading(true);
    try {
      const response = await getCompanyAdmins(currentPage, 10, searchTerm);
      setCompanyAdmins(response.data.items);
      setTotalPages(response.data.pagination.totalPages);
    } catch (_error) {
      toast.error("Failed to fetch company admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "companies") {
      fetchCompanies();
    } else {
      fetchCompanyAdmins();
    }
  }, [activeTab, currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setModalMode("create");
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalMode("edit");
    setIsCompanyModalOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalMode("view");
    setIsCompanyModalOpen(true);
  };

  const handleCreateAdmin = () => {
    setSelectedAdmin(null);
    setModalMode("create");
    setIsAdminModalOpen(true);
  };

  const handleEditAdmin = (admin: CompanyAdmin) => {
    setSelectedAdmin(admin);
    setModalMode("edit");
    setIsAdminModalOpen(true);
  };

  const handleResetPassword = (admin: CompanyAdmin) => {
    setSelectedAdmin(admin);
    setIsPasswordResetModalOpen(true);
  };

  const handleToggleCompanyStatus = async (companyId: string) => {
    try {
      await toggleCompanyStatus(companyId);
      toast.success("Company status updated successfully");
      fetchCompanies();
    } catch (_error) {
      toast.error("Failed to update company status");
    }
  };

  const handleToggleAdminStatus = async (adminId: string) => {
    try {
      await toggleCompanyAdminStatus(adminId);
      toast.success("Admin status updated successfully");
      fetchCompanyAdmins();
    } catch (_error) {
      toast.error("Failed to update admin status");
    }
  };

  const handleDeleteCompany = (company: Company) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Company",
      message: `Are you sure you want to delete "${company.companyName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCompany(company._id);
          toast.success("Company deleted successfully");
          fetchCompanies();
        } catch (_error) {
          toast.error("Failed to delete company");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteAdmin = (admin: CompanyAdmin) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Company Admin",
      message: `Are you sure you want to delete "${admin.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCompanyAdmin(admin._id);
          toast.success("Company admin deleted successfully");
          fetchCompanyAdmins();
        } catch (_error) {
          toast.error("Failed to delete company admin");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Companies Management</h1>
        <p className="text-muted-foreground">
          Manage companies and their administrators
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Company Admins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Companies
                </CardTitle>
                <Button
                  onClick={handleCreateCompany}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Company
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admins</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          {renderLoadingSkeleton()}
                        </TableCell>
                      </TableRow>
                    ) : companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No companies found
                        </TableCell>
                      </TableRow>
                    ) : (
                      companies.map((company) => (
                        <TableRow key={company._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={company.logo || ""}
                                alt={company.companyName}
                                width={32}
                                height={32}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {company.companyName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {company.address}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                company.isActive ? "default" : "secondary"
                              }
                            >
                              {company.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{company.adminsCount || 0}</TableCell>
                          <TableCell>
                            {new Date(company.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewCompany(company)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditCompany(company)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleCompanyStatus(company._id)
                                  }
                                >
                                  <Power className="h-4 w-4 mr-2" />
                                  {company.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCompany(company)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderPagination()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Company Admins
                </CardTitle>
                <Button
                  onClick={handleCreateAdmin}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search admins..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          {renderLoadingSkeleton()}
                        </TableCell>
                      </TableRow>
                    ) : companyAdmins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No company admins found
                        </TableCell>
                      </TableRow>
                    ) : (
                      companyAdmins.map((admin) => (
                        <TableRow key={admin._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {admin.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {typeof admin.companyId === "object"
                              ? admin.companyId.companyName
                              : "Unknown Company"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={admin.isActive ? "default" : "secondary"}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditAdmin(admin)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleResetPassword(admin)}
                                >
                                  <Key className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleAdminStatus(admin._id)
                                  }
                                >
                                  <Power className="h-4 w-4 mr-2" />
                                  {admin.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteAdmin(admin)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderPagination()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        company={selectedCompany}
        mode={modalMode}
        onSuccess={() => {
          fetchCompanies();
          setIsCompanyModalOpen(false);
        }}
      />

      <CompanyAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        admin={selectedAdmin}
        mode={modalMode}
        onSuccess={() => {
          fetchCompanyAdmins();
          setIsAdminModalOpen(false);
        }}
      />

      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
        admin={selectedAdmin}
        onSuccess={() => {
          fetchCompanyAdmins();
          setIsPasswordResetModalOpen(false);
        }}
      />

      <ConfirmationModal
        open={confirmModal.isOpen}
        onOpenChange={() =>
          setConfirmModal((prev) => ({ ...prev, open: false }))
        }
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.message}
      />
    </div>
  );
}
