import axiosInstance from "@/lib/axios";

// Create Banner
export const createBanner = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/admin/banners", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

// Get Banners (paginated)
export const getBanners = async (page?: number, limit?: number) => {
  try {
    const response = await axiosInstance.get("/admin/banners", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

// Update Banner
export const updateBanner = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(`/admin/banners/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

// Toggle Status
export const toggleBannerStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/banners/toggle/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling banner status:", error);
    throw error;
  }
};

// Delete Banner
export const deleteBanner = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/banners/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
