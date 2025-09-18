import axios from "axios";
import axiosInstance from "@/lib/axios";

export const getFaqs = async () => {
  try {
    const response = await axiosInstance.get("/admin/faq");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const getFaqId = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/admin/faq/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const createFaqs = async ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  try {
    const response = await axiosInstance.post("/admin/faq", {
      question,
      answer,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const updateFaq = async (
  id: string,
  data: { question: string; answer: string }
) => {
  try {
    const response = await axiosInstance.put(`/admin/faq/edit/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const deleteFaq = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/faq/delete/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const toggleFaqStatus = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/admin/faq/toggle-status/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
