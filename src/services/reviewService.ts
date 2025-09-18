import axios from "axios";
import axiosInstance from "@/lib/axios";

export const getReviews = async (page?: number) => {
  try {
    const response = await axiosInstance.get("/admin/reviews", {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

export const toggleReviewStatus = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling review status:", error);
  }
};

export const approveReview = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/approve/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Error in approving: ${error}`);
  }
};

export const toggleFeatured = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/featured/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
