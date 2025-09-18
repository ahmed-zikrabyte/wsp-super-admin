import axiosInstance from "@/lib/axios";

export const getUsers = async (search?: string, page?: number) => {
  try {
    const response = await axiosInstance.get("/admin/users", {
      params: {
        search,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleUserStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};
