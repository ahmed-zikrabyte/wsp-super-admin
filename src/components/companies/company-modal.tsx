"use client";

import {
  Building2,
  FileText,
  Globe,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createCompany, updateCompany } from "@/services/superAdminService";
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types/superAdmin.types";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  mode: "create" | "edit" | "view";
  onSuccess: () => void;
}

export default function CompanyModal({
  isOpen,
  onClose,
  company,
  mode,
  onSuccess,
}: CompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    address: "",
    logo: "",
    kycDocs: [] as string[],
  });

  useEffect(() => {
    if (company && (mode === "edit" || mode === "view")) {
      setFormData({
        companyName: company.companyName,
        website: company.website,
        address: company.address,
        logo: company.logo,
        kycDocs: company.kycDocs,
      });
    } else {
      setFormData({
        companyName: "",
        website: "",
        address: "",
        logo: "",
        kycDocs: [],
      });
    }
  }, [company, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKycDocsChange = (value: string) => {
    const docs = value
      .split(",")
      .map((doc) => doc.trim())
      .filter((doc) => doc);
    setFormData((prev) => ({ ...prev, kycDocs: docs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await createCompany(formData as CreateCompanyRequest);
        toast.success("Company created successfully");
      } else if (mode === "edit" && company) {
        await updateCompany(company._id, formData as UpdateCompanyRequest);
        toast.success("Company updated successfully");
      }
      onSuccess();
    } catch (_error) {
      toast.error(`Failed to ${mode} company`);
    } finally {
      setLoading(false);
    }
  };

  const isReadonly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === "create" && "Create New Company"}
            {mode === "edit" && "Edit Company"}
            {mode === "view" && "Company Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                disabled={isReadonly}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                disabled={isReadonly}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter company address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={isReadonly}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Logo URL
            </Label>
            <Input
              id="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={(e) => handleInputChange("logo", e.target.value)}
              disabled={isReadonly}
              required
            />
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Company logo preview"
                  width={64}
                  height={64}
                  className="object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kycDocs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              KYC Documents (comma separated URLs)
            </Label>
            <Textarea
              id="kycDocs"
              placeholder="doc1.pdf, doc2.pdf, doc3.pdf"
              value={formData.kycDocs.join(", ")}
              onChange={(e) => handleKycDocsChange(e.target.value)}
              disabled={isReadonly}
              rows={3}
            />
            {formData.kycDocs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.kycDocs.map((doc, index) => (
                  <Badge key={index} variant="outline">
                    {doc}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {mode === "view" && company && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge variant={company.isActive ? "default" : "secondary"}>
                  {company.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Admins Count</Label>
                <p className="text-sm">{company.adminsCount || 0}</p>
              </div>
              <div className="space-y-2">
                <Label>Created At</Label>
                <p className="text-sm">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {new Date(company.updatedAt).toLocaleDateString()}
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
                    ? "Create Company"
                    : "Update Company"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
