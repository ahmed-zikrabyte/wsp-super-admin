import { categoryEndpoints } from "@/config/category.endpoints";
import { apiService } from "@/lib/apiService";
import type {
  BulkUpdateDisplayOrderRequest,
  Category,
  CategoryFilters,
  CategoryListResponse,
  CategoryStats,
  CategoryTreeNode,
  CreateCategoryRequest,
  MoveCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.types";
import type { ApiResponse } from "@/types/superAdmin.types";

export const getCategories = async (
  filters?: CategoryFilters
): Promise<CategoryListResponse> => {
  const params: any = {};

  if (filters?.search) params.search = filters.search;
  if (filters?.level !== undefined) params.level = filters.level;
  if (filters?.parentId) params.parentId = filters.parentId;
  if (filters?.isActive !== undefined) params.isActive = filters.isActive;
  if (filters?.hasProducts !== undefined)
    params.hasProducts = filters.hasProducts;
  if (filters?.supportedGenders?.length)
    params.supportedGenders = filters.supportedGenders;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;

  return apiService.get(categoryEndpoints.categories.getAll, { params });
};

export const getCategoryTree = async (): Promise<
  ApiResponse<{ tree: CategoryTreeNode[] }>
> => {
  return apiService.get(categoryEndpoints.categories.getTree);
};

export const getCategoryStats = async (): Promise<
  ApiResponse<CategoryStats>
> => {
  return apiService.get(categoryEndpoints.categories.getStats);
};

export const getCategoryById = async (
  id: string
): Promise<ApiResponse<Category>> => {
  return apiService.get(categoryEndpoints.categories.get(id));
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<ApiResponse<Category>> => {
  const formData = new FormData();

  formData.append("name", data.name);
  if (data.parentId) formData.append("parentId", data.parentId);
  if (data.description) formData.append("description", data.description);
  if (data.displayOrder !== undefined)
    formData.append("displayOrder", data.displayOrder.toString());

  if (data.supportedGenders?.length) {
    data.supportedGenders.forEach((gender) =>
      formData.append("supportedGenders", gender)
    );
  }

  if (data.hasGenderVariants !== undefined)
    formData.append("hasGenderVariants", data.hasGenderVariants.toString());
  if (data.hasSizeGuide !== undefined)
    formData.append("hasSizeGuide", data.hasSizeGuide.toString());
  if (data.requiresFitting !== undefined)
    formData.append("requiresFitting", data.requiresFitting.toString());

  if (data.seo) {
    if (data.seo.title) formData.append("seo[title]", data.seo.title);
    if (data.seo.description)
      formData.append("seo[description]", data.seo.description);
    if (data.seo.keywords?.length) {
      data.seo.keywords.forEach((keyword) =>
        formData.append("seo[keywords]", keyword)
      );
    }
  }

  if (data.image) {
    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else {
      formData.append("imageUrl", data.image);
    }
  }

  return apiService.post(categoryEndpoints.categories.create, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<ApiResponse<Category>> => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.parentId !== undefined)
    formData.append("parentId", data.parentId || "");
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.displayOrder !== undefined)
    formData.append("displayOrder", data.displayOrder.toString());
  if (data.isActive !== undefined)
    formData.append("isActive", data.isActive.toString());

  if (data.supportedGenders) {
    data.supportedGenders.forEach((gender) =>
      formData.append("supportedGenders", gender)
    );
  }

  if (data.hasGenderVariants !== undefined)
    formData.append("hasGenderVariants", data.hasGenderVariants.toString());
  if (data.hasSizeGuide !== undefined)
    formData.append("hasSizeGuide", data.hasSizeGuide.toString());
  if (data.requiresFitting !== undefined)
    formData.append("requiresFitting", data.requiresFitting.toString());

  if (data.seo) {
    if (data.seo.title !== undefined)
      formData.append("seo[title]", data.seo.title);
    if (data.seo.description !== undefined)
      formData.append("seo[description]", data.seo.description);
    if (data.seo.keywords) {
      data.seo.keywords.forEach((keyword) =>
        formData.append("seo[keywords]", keyword)
      );
    }
  }

  if (data.image) {
    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else {
      formData.append("imageUrl", data.image);
    }
  }

  return apiService.patch(categoryEndpoints.categories.update(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadCategoryImage = async (
  id: string,
  imageFile: File
): Promise<ApiResponse<Category>> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return apiService.patch(
    categoryEndpoints.categories.uploadImage(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const toggleCategoryStatus = async (
  id: string
): Promise<ApiResponse<Category>> => {
  return apiService.patch(categoryEndpoints.categories.toggleStatus(id));
};

export const moveCategory = async (
  id: string,
  data: MoveCategoryRequest
): Promise<ApiResponse<Category>> => {
  return apiService.patch(categoryEndpoints.categories.move(id), data);
};

export const bulkUpdateDisplayOrder = async (
  data: BulkUpdateDisplayOrderRequest
): Promise<ApiResponse<null>> => {
  return apiService.patch(
    categoryEndpoints.categories.bulkUpdateDisplayOrder,
    data
  );
};

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiService.delete(categoryEndpoints.categories.delete(id));
};

export const getCategoriesByParent = async (
  parentId?: string,
  page?: number,
  limit?: number
): Promise<CategoryListResponse> => {
  const params: any = {};
  if (parentId) params.parentId = parentId;
  else params.level = 1;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return apiService.get(categoryEndpoints.categories.getByParent, { params });
};

export const searchCategories = async (
  query: string,
  limit = 10
): Promise<CategoryListResponse> => {
  return apiService.get(categoryEndpoints.categories.search, {
    params: { search: query, limit },
  });
};

export const getCategoryPath = async (
  id: string
): Promise<ApiResponse<{ path: Category[] }>> => {
  return apiService.get(categoryEndpoints.categories.getPath(id));
};

export const validateCategoryName = async (
  name: string,
  parentId?: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const params: any = { name };
    if (parentId) params.parentId = parentId;
    if (excludeId) params.excludeId = excludeId;

    await apiService.get(categoryEndpoints.categories.validateName, { params });
    return true;
  } catch (_error) {
    return false;
  }
};
