import { superAdminEndpoints } from "@/config/superAdmin.endpoints";
import { apiService } from "@/lib/apiService";
import type {
  ApiResponse,
  Company,
  CompanyAdmin,
  CreateCompanyAdminRequest,
  CreateCompanyRequest,
  PaginationResponse,
  ResetPasswordRequest,
  UpdateCompanyAdminRequest,
  UpdateCompanyRequest,
} from "@/types/superAdmin.types";

export const getCompanies = async (
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginationResponse<Company>> => {
  return apiService.get(superAdminEndpoints.companies.getAll, {
    params: { page, limit, search },
  });
};

export const getCompanyById = async (
  companyId: string
): Promise<ApiResponse<Company>> => {
  return apiService.get(superAdminEndpoints.companies.get(companyId));
};

export const createCompany = async (
  companyData: CreateCompanyRequest
): Promise<ApiResponse<Company>> => {
  return apiService.post(superAdminEndpoints.companies.create, companyData);
};

export const updateCompany = async (
  companyId: string,
  companyData: UpdateCompanyRequest
): Promise<ApiResponse<Company>> => {
  return apiService.put(
    superAdminEndpoints.companies.update(companyId),
    companyData
  );
};

export const deleteCompany = async (
  companyId: string
): Promise<ApiResponse<null>> => {
  return apiService.delete(superAdminEndpoints.companies.delete(companyId));
};

export const toggleCompanyStatus = async (
  companyId: string
): Promise<ApiResponse<Company>> => {
  return apiService.patch(
    superAdminEndpoints.companies.toggleStatus(companyId)
  );
};

export const getCompanyAdmins = async (
  page?: number,
  limit?: number,
  search?: string,
  companyId?: string
): Promise<PaginationResponse<CompanyAdmin>> => {
  return apiService.get(superAdminEndpoints.companyAdmins.getAll, {
    params: { page, limit, search, companyId },
  });
};

export const getCompanyAdminById = async (
  adminId: string
): Promise<ApiResponse<CompanyAdmin>> => {
  return apiService.get(superAdminEndpoints.companyAdmins.get(adminId));
};

export const createCompanyAdmin = async (
  adminData: CreateCompanyAdminRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  return apiService.post(superAdminEndpoints.companyAdmins.create, adminData);
};

export const updateCompanyAdmin = async (
  adminId: string,
  adminData: UpdateCompanyAdminRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  return apiService.put(
    superAdminEndpoints.companyAdmins.update(adminId),
    adminData
  );
};

export const deleteCompanyAdmin = async (
  adminId: string
): Promise<ApiResponse<null>> => {
  return apiService.delete(superAdminEndpoints.companyAdmins.delete(adminId));
};

export const toggleCompanyAdminStatus = async (
  adminId: string
): Promise<ApiResponse<CompanyAdmin>> => {
  return apiService.patch(
    superAdminEndpoints.companyAdmins.toggleStatus(adminId)
  );
};

export const resetCompanyAdminPassword = async (
  adminId: string,
  passwordData: ResetPasswordRequest
): Promise<ApiResponse<CompanyAdmin>> => {
  return apiService.patch(
    superAdminEndpoints.companyAdmins.resetPassword(adminId),
    passwordData
  );
};

export const getCompanyAdminsByCompany = async (
  companyId: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<CompanyAdmin>> => {
  return apiService.get(
    superAdminEndpoints.companyAdmins.getByCompany(companyId),
    {
      params: { page, limit },
    }
  );
};
