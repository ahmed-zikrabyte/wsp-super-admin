import axiosInstance from "@/lib/axios";

export const createProduct = async (productData: FormData) => {
  try {
    const response = await axiosInstance.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProducts = async (search?: string, page?: number) => {
  try {
    const response = await axiosInstance.get("/admin/products", {
      params: {
        search,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const toggleProductStatus = async (slug: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw error;
  }
};

export const deleteProduct = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/admin/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

export const updateProduct = async (slug: string, productData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/products/${slug}`,
      productData
    );
    console.log(response.data, "product");
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
