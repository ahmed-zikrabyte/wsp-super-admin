import type { ConfigFormValues } from "@/app/(dashboard)/config/create/page";
import axiosInstance from "@/lib/axios";

export const createConfig = async (config: ConfigFormValues) => {
  try {
    const response = await axiosInstance.post("admin/config", config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfig = async () => {
  try {
    const response = await axiosInstance.get("admin/config");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConfig = async (id: string, config: ConfigFormValues) => {
  try {
    const response = await axiosInstance.put(`admin/config/${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
