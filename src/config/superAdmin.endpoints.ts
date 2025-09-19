import type { TEndpoint } from "@/types/superAdmin.types";

export const superAdminEndpoints = {
  companies: {
    getAll: { method: "get" as const, url: "super-admin/companies" },
    get: (id: string): TEndpoint => ({
      method: "get",
      url: `super-admin/companies/${id}`,
    }),
    create: { method: "post" as const, url: "super-admin/companies" },
    update: (id: string): TEndpoint => ({
      method: "put",
      url: `super-admin/companies/${id}`,
    }),
    delete: (id: string): TEndpoint => ({
      method: "delete",
      url: `super-admin/companies/${id}`,
    }),
    toggleStatus: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/companies/${id}/toggle-status`,
    }),
  },
  companyAdmins: {
    getAll: { method: "get" as const, url: "super-admin/company-admins" },
    get: (id: string): TEndpoint => ({
      method: "get",
      url: `super-admin/company-admins/${id}`,
    }),
    create: { method: "post" as const, url: "super-admin/company-admins" },
    update: (id: string): TEndpoint => ({
      method: "put",
      url: `super-admin/company-admins/${id}`,
    }),
    delete: (id: string): TEndpoint => ({
      method: "delete",
      url: `super-admin/company-admins/${id}`,
    }),
    toggleStatus: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/company-admins/${id}/toggle-status`,
    }),
    resetPassword: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/company-admins/${id}/reset-password`,
    }),
    getByCompany: (companyId: string): TEndpoint => ({
      method: "get",
      url: `super-admin/company-admins/company/${companyId}`,
    }),
  },
};
