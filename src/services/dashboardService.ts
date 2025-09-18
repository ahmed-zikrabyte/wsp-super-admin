import axiosInstance from "@/lib/axios";

export const fetchDashboardData = async () => {
  const response = await axiosInstance("/admin/dashboard");
  return response.data;
};

export const fetchChartData = async (range: string) => {
  const response = await axiosInstance(`/admin/dashboard/chart?range=${range}`);
  return response.data;
};
