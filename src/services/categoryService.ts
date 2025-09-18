import axiosInstance from "@/lib/axios";

export const createCategory = async (categoryData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "/admin/categories",
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const toggleCategoryStatus = async (slug: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const viewCategory = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/admin/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const updateCategory = async (slug: string, categoryData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/categories/${slug}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};
