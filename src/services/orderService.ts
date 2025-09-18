import axiosInstance from "@/lib/axios";

export const getOrders = async (
  startDate: string,
  endDate: string,
  search: string,
  page: number
) => {
  try {
    const response = await axiosInstance.get("/admin/orders", {
      params: {
        startDate,
        endDate,
        search,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const exportOrders = async () => {
  try {
    const response = await axiosInstance.get("/admin/orders/export", {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const generateShiprocketDocument = async (order: any, type: string) => {
  try {
    const response = await axiosInstance.post(
      "/admin/orders/generate-shiprocket-doc",
      {
        order,
        type,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const requestPickup = async (order: any, pickupDate: string) => {
  try {
    console.log({ pickupDate });
    const response = await axiosInstance.post("/admin/orders/request-pickup", {
      order,
      pickupDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const assignAWB = async (shipmentId: string, courierId: string) => {
  try {
    const response = await axiosInstance.post("/admin/orders/assign-awb", {
      shipmentId,
      courierId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const generateDocument = async (order: any, type: string) => {
  try {
    const response = await axiosInstance.post("/admin/orders/generate-doc", {
      order,
      type,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
