import axiosInstance from "@/lib/axios";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    total: number;
  };
}

export const getContacts = async (
  search: string,
  page: number
): Promise<{ data: ContactsResponse }> => {
  try {
    const response = await axiosInstance.get("/admin/contacts", {
      params: {
        search,
        page,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};
