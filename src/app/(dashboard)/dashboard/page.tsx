"use client";

import axios from "axios";
import { IndianRupee, Package, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchChartData,
  fetchDashboardData,
} from "@/services/dashboardService";
import type { IDashboard } from "@/typing";

type RawPoint = {
  _id: { week?: string; day?: string; month?: string; year?: string };
  totalOrders: number;
  totalSales: number;
};

type ChartPoint = {
  date: string;
  totalOrders: number;
  totalSales: string;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<IDashboard | null>(null);
  const [range, setRange] = useState<"day" | "week" | "month" | "year">("week");
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      const response = await fetchDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  const fetchChart = async () => {
    try {
      const response = await fetchChartData(range); // pass range to API
      console.log(response);
      const raw: RawPoint[] = response.data;

      // ✅ Flatten into chart-friendly format
      const formatted: ChartPoint[] = raw.map((item) => {
        const key = Object.keys(item._id)[0] as keyof typeof item._id; // e.g., "week"
        return {
          date: item._id[key] ?? "",
          totalOrders: item.totalOrders,
          totalSales: item.totalSales.toFixed(2),
        };
      });

      console.log({ formatted });

      setChartData(formatted);
    } catch (error) {
      console.error("Chart fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchChart();
  }, [range]);

  return (
    <div className="h-max bg-background">
      <main className="max-w-7xl mx-auto p-6">
        {/* --- Top Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users Card */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {dashboardData?.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{dashboardData?.usersJoinedLastWeek} users joined last week
              </p>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card className="bg-secondary border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">
                {dashboardData?.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{dashboardData?.totalProductsAddedLastWeek} new products added
                last week
              </p>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
              <IndianRupee className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                ₹{dashboardData?.totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="bg-secondary border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">
                {dashboardData?.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{dashboardData?.totalOrdersInLastWeek} in the last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Sales Chart --- */}
        <Card className="mt-8 p-5">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Sales & Orders</CardTitle>
            <Select
              value={range}
              onValueChange={(value) =>
                setRange(value as "day" | "week" | "month" | "year")
              }
            >
              {" "}
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "Sales (₹)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                {/* Right Y-axis for Orders */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Orders",
                    angle: 90,
                    position: "insideRight",
                  }}
                />
                <Tooltip
                  labelFormatter={(date) =>
                    new Date(date as string).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Legend />
                {/* Sales Line */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#8884d8"
                  name="Sales (₹)"
                  strokeWidth={2}
                />

                {/* Orders Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#82ca9d"
                  name="Orders"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
