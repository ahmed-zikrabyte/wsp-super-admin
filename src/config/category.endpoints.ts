import type { TEndpoint } from "@/types/superAdmin.types";

export const categoryEndpoints = {
  categories: {
    getAll: { method: "get" as const, url: "super-admin/categories" },
    getTree: { method: "get" as const, url: "super-admin/categories/tree" },
    getStats: { method: "get" as const, url: "super-admin/categories/stats" },
    get: (id: string): TEndpoint => ({
      method: "get",
      url: `super-admin/categories/${id}`,
    }),
    create: { method: "post" as const, url: "super-admin/categories" },
    update: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/categories/${id}`,
    }),
    delete: (id: string): TEndpoint => ({
      method: "delete",
      url: `super-admin/categories/${id}`,
    }),
    uploadImage: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/categories/${id}/image`,
    }),
    toggleStatus: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/categories/${id}/toggle-status`,
    }),
    move: (id: string): TEndpoint => ({
      method: "patch",
      url: `super-admin/categories/${id}/move`,
    }),
    bulkUpdateDisplayOrder: {
      method: "patch" as const,
      url: "super-admin/categories/bulk/display-order",
    },
    getByParent: { method: "get" as const, url: "super-admin/categories" },
    search: { method: "get" as const, url: "super-admin/categories" },
    getPath: (id: string): TEndpoint => ({
      method: "get",
      url: `super-admin/categories/${id}/path`,
    }),
    validateName: {
      method: "get" as const,
      url: "super-admin/categories/validate-name",
    },
  },
};
