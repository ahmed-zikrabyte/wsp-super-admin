import axiosInstance from "@/lib/axios";

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

export const getCompanies = async (
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginationResponse<Company>> => {
  try {
    const response = await axiosInstance.get("/super-admin/companies", {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompanyById = async (
  companyId: string
): Promise<ApiResponse<Company>> => {
  try {
    const response = await axiosInstance.get(
      `/super-admin/companies/${companyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    throw error;
  }
};

export const createCompany = async (
  companyData: CreateCompanyRequest
): Promise<ApiResponse<Company>> => {
  try {
    const response = await axiosInstance.post(
      "/super-admin/companies",
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const updateCompany = async (
  companyId: string,
  companyData: UpdateCompanyRequest
): Promise<ApiResponse<Company>> => {
  try {
    const response = await axiosInstance.put(
      `/super-admin/companies/${companyId}`,
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompany = async (
  companyId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.delete(
      `/super-admin/companies/${companyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const toggleCompanyStatus = async (
  companyId: string
): Promise<ApiResponse<Company>> => {
  try {
    const response = await axiosInstance.patch(
      `/super-admin/companies/${companyId}/toggle-status`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling company status:", error);
    throw error;
  }
};

export const getCompanyAdmins = async (
  page?: number,
  limit?: number,
  search?: string,
  companyId?: string
): Promise<PaginationResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.get("/super-admin/company-admins", {
      params: { page, limit, search, companyId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching company admins:", error);
    throw error;
  }
};

export const getCompanyAdminById = async (
  adminId: string
): Promise<ApiResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.get(
      `/super-admin/company-admins/${adminId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company admin by ID:", error);
    throw error;
  }
};

export const createCompanyAdmin = async (
  adminData: CreateCompanyAdminRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.post(
      "/super-admin/company-admins",
      adminData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating company admin:", error);
    throw error;
  }
};

export const updateCompanyAdmin = async (
  adminId: string,
  adminData: UpdateCompanyAdminRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.put(
      `/super-admin/company-admins/${adminId}`,
      adminData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating company admin:", error);
    throw error;
  }
};

export const deleteCompanyAdmin = async (
  adminId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.delete(
      `/super-admin/company-admins/${adminId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting company admin:", error);
    throw error;
  }
};

export const toggleCompanyAdminStatus = async (
  adminId: string
): Promise<ApiResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.patch(
      `/super-admin/company-admins/${adminId}/toggle-status`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling company admin status:", error);
    throw error;
  }
};

export const resetCompanyAdminPassword = async (
  adminId: string,
  passwordData: ResetPasswordRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.patch(
      `/super-admin/company-admins/${adminId}/reset-password`,
      passwordData
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting company admin password:", error);
    throw error;
  }
};

export const getCompanyAdminsByCompany = async (
  companyId: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<CompanyAdmin>> => {
  try {
    const response = await axiosInstance.get(
      `/super-admin/company-admins/company/${companyId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company admins by company:", error);
    throw error;
  }
};
