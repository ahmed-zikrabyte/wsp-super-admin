import axiosInstance from "@/lib/axios";

export const createBox = async (boxData: any) => {
  try {
    const response = await axiosInstance.post("/admin/boxes", boxData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBoxes = async () => {
  const response = await axiosInstance.get("/admin/boxes");
  return response.data;
};

export const getBoxById = async (id: string) => {
  const response = await axiosInstance.get(`/admin/boxes/${id}`);
  return response.data;
};

export const updateBox = async (id: string, boxData: any) => {
  const response = await axiosInstance.put(`/admin/boxes/${id}`, boxData);
  return response.data;
};

export const deleteBox = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/boxes/${id}`);
  return response.data;
};
