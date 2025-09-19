export interface Company {
  _id: string;
  companyName: string;
  website: string;
  address: string;
  logo: string;
  kycDocs: string[];
  isActive: boolean;
  adminsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyId: Company | string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  website: string;
  address: string;
  logo: string;
  kycDocs: string[];
}

export interface UpdateCompanyRequest {
  companyName?: string;
  website?: string;
  address?: string;
  logo?: string;
  kycDocs?: string[];
}

export interface CreateCompanyAdminRequest {
  name: string;
  email: string;
  password: string;
  companyId: string;
}

export interface UpdateCompanyAdminRequest {
  name?: string;
  email?: string;
  companyId?: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type Method = "get" | "post" | "patch" | "delete" | "put";

export interface TEndpoint {
  method: Method;
  url: string;
}
