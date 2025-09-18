// stores/useStatsStore.ts
import { create } from "zustand";
import axiosInstance from "@/lib/axios";

type Stats = {
  products: number;
  categories: number;
  reviews: number;
  users: number;
  coupons: number;
  orders: number;
  boxes: number;
  contacts: number;
  banners: number;

  faqs: number;

  fetchStats: () => Promise<void>;
  incrementProduct: () => void;
  decrementProduct: () => void;
  incrementCategory: () => void;
  decrementCategory: () => void;
  incrementReview: () => void;
  decrementReview: () => void;
  incrementCoupon: () => void;
  decrementCoupon: () => void;
  incrementBox: () => void;
  decrementBox: () => void;
  incrementContact: () => void;
  decrementContact: () => void;
  incrementBanner: () => void;
  decrementBanner: () => void;
};

export const useStatsStore = create<Stats>((set) => ({
  products: 0,
  categories: 0,
  reviews: 0,
  users: 0,
  coupons: 0,
  orders: 0,
  boxes: 0,
  contacts: 0,

  banners: 0,

  faqs: 0,

  fetchStats: async () => {
    const res = await axiosInstance.get("/admin/stats"); // API should return { products, categories, reviews }
    console.log({ res }, "store");
    const {
      totalProducts,
      totalCategories,
      totalReviews,
      totalUsers,
      totalCoupons,
      totalOrders,
      totalBoxes,
      totalContacts,

      totalBanners,

      totalFaqs,
    } = res.data.data;
    set({
      products: totalProducts,
      categories: totalCategories,
      reviews: totalReviews,
      users: totalUsers,
      coupons: totalCoupons,
      orders: totalOrders,
      boxes: totalBoxes,
      contacts: totalContacts,

      banners: totalBanners,

      faqs: totalFaqs,
    });
  },

  incrementProduct: () => set((state) => ({ products: state.products + 1 })),
  decrementProduct: () => set((state) => ({ products: state.products - 1 })),

  incrementCategory: () =>
    set((state) => ({ categories: state.categories + 1 })),
  decrementCategory: () =>
    set((state) => ({ categories: state.categories - 1 })),

  incrementReview: () => set((state) => ({ reviews: state.reviews + 1 })),
  decrementReview: () => set((state) => ({ reviews: state.reviews - 1 })),

  incrementCoupon: () => set((state) => ({ coupons: state.coupons + 1 })),
  decrementCoupon: () => set((state) => ({ coupons: state.coupons - 1 })),

  incrementBox: () => set((state) => ({ boxes: state.boxes + 1 })),
  decrementBox: () => set((state) => ({ boxes: state.boxes - 1 })),

  incrementContact: () => set((state) => ({ contacts: state.contacts + 1 })),
  decrementContact: () => set((state) => ({ contacts: state.contacts - 1 })),
  incrementBanner: () => set((state) => ({ banners: state.banners + 1 })),
  decrementBanner: () => set((state) => ({ banners: state.banners - 1 })),
}));
