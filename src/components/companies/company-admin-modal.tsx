"use client";

import { Building2, Key, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Company,
  type CompanyAdmin,
  type CreateCompanyAdminRequest,
  createCompanyAdmin,
  getCompanies,
  type UpdateCompanyAdminRequest,
  updateCompanyAdmin,
} from "@/services/superAdminService";

interface CompanyAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: CompanyAdmin | null;
  mode: "create" | "edit" | "view";
  onSuccess: () => void;
}

export default function CompanyAdminModal({
  isOpen,
  onClose,
  admin,
  mode,
  onSuccess,
}: CompanyAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (admin && (mode === "edit" || mode === "view")) {
      setFormData({
        name: admin.name,
        email: admin.email,
        password: "",
        companyId:
          typeof admin.companyId === "object"
            ? admin.companyId._id
            : admin.companyId,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        companyId: "",
      });
    }
  }, [admin, mode]);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies(1, 100);
      setCompanies(response.data.items);
    } catch (_error) {
      toast.error("Failed to fetch companies");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await createCompanyAdmin(formData as CreateCompanyAdminRequest);
        toast.success("Company admin created successfully");
      } else if (mode === "edit" && admin) {
        const updateData: UpdateCompanyAdminRequest = {
          name: formData.name,
          email: formData.email,
          companyId: formData.companyId,
        };
        await updateCompanyAdmin(admin._id, updateData);
        toast.success("Company admin updated successfully");
      }
      onSuccess();
    } catch (_error) {
      toast.error(`Failed to ${mode} company admin`);
    } finally {
      setLoading(false);
    }
  };

  const isReadonly = mode === "view";
  const selectedCompany = companies.find((c) => c._id === formData.companyId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === "create" && "Create New Company Admin"}
            {mode === "edit" && "Edit Company Admin"}
            {mode === "view" && "Company Admin Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter admin name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isReadonly}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isReadonly}
              required
            />
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="companyId" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </Label>
            {isReadonly ? (
              <div className="p-2 border rounded-md bg-muted">
                {selectedCompany?.companyName || "Unknown Company"}
              </div>
            ) : (
              <Select
                value={formData.companyId}
                onValueChange={(value) => handleInputChange("companyId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={company.logo}
                          alt={company.companyName}
                          width={16}
                          height={16}
                          className="rounded object-cover"
                        />
                        {company.companyName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {mode === "view" && admin && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge variant={admin.isActive ? "default" : "secondary"}>
                  {admin.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant="outline">{admin.role}</Badge>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Created At</Label>
                <p className="text-sm">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {!isReadonly && (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Admin"
                    : "Update Admin"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
