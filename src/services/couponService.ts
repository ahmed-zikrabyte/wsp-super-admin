import type { CouponFormValues } from "@/app/(dashboard)/coupons/create/page";
import axiosInstance from "@/lib/axios";
export const createCoupon = async (couponData: CouponFormValues) => {
  try {
    const response = await axiosInstance.post("/admin/coupons", couponData);
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const getCoupons = async (
  page: number,
  status: "all" | "inactive" | "active"
) => {
  try {
    const response = await axiosInstance.get(
      `/admin/coupons?page=${page}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const toggleCouponStatus = async (code: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/coupons`, {
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling coupon status:", error);
    throw error;
  }
};

export const updateCoupon = async (slug: string, couponData: any) => {
  try {
    const response = await axiosInstance.put(
      `/admin/coupons/${slug}`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const getCouponByCode = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/admin/coupons/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon by code:", error);
    throw error;
  }
};

export const getAdminCoupons = async (
  page: number,
  status: "all" | "inactive" | "active"
) => {
  try {
    console.log({ status });
    const response = await axiosInstance.get(
      `/admin/coupons/admin-coupons?page=${page}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};
