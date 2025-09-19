"use client";

import {
  Activity,
  BarChart3,
  Building2,
  DollarSign,
  Eye,
  Package,
  Phone,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CustomerEngagement,
  type DashboardStats,
  type DeliveryPerformance,
  getCustomerEngagement,
  getDashboardStats,
  getDeliveryPerformance,
  getPromotionsData,
  getRefundsReturns,
  getTopPerformers,
  type PromotionsData,
  type RefundsReturns,
  type TopPerformers,
} from "@/services/dashboardService";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(
    null
  );
  const [customerEngagement, setCustomerEngagement] =
    useState<CustomerEngagement | null>(null);
  const [deliveryPerformance, setDeliveryPerformance] =
    useState<DeliveryPerformance | null>(null);
  const [refundsReturns, setRefundsReturns] = useState<RefundsReturns | null>(
    null
  );
  const [promotionsData, setPromotionsData] = useState<PromotionsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          topPerformersData,
          customerEngagementData,
          deliveryPerformanceData,
          refundsReturnsData,
          promotionsDataResponse,
        ] = await Promise.all([
          getDashboardStats(),
          getTopPerformers(),
          getCustomerEngagement(),
          getDeliveryPerformance(),
          getRefundsReturns(),
          getPromotionsData(),
        ]);

        setStats(statsData);
        setTopPerformers(topPerformersData);
        setCustomerEngagement(customerEngagementData);
        setDeliveryPerformance(deliveryPerformanceData);
        setRefundsReturns(refundsReturnsData);
        setPromotionsData(promotionsDataResponse);
      } catch (_error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  if (loading || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete overview and control center for the e-commerce ecosystem
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Master Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics & Reports
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Controls & Admin Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Master Dashboard Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Companies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Companies
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.companies.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    KYC: {stats.companies.kycApproved}
                  </span>
                  <span className="text-yellow-600">
                    Pending: {stats.companies.kycPending}
                  </span>
                  <span className="text-red-600">
                    Rejected: {stats.companies.kycRejected}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Company Admins */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Company Admins
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.companyAdmins.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.companyAdmins.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.companyAdmins.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Brands */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Brands
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.brands.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.brands.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.brands.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Brand Admins */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Brand Admins
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.brandAdmins.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.brandAdmins.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.brandAdmins.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.categories.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.categories.subcategories)} subcategories
                </p>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.products.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.products.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.products.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stores */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stores
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.stores.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {stats.stores.cityBreakdown.length} cities
                </p>
              </CardContent>
            </Card>

            {/* Store Managers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Store Managers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.storeManagers.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.storeManagers.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.storeManagers.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Store Executives */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Store Executives
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.storeExecutives.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.storeExecutives.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.storeExecutives.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Partners */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Delivery Partners
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.deliveryPartners.total)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Active: {stats.deliveryPartners.active}
                  </span>
                  <span className="text-gray-600">
                    Inactive: {stats.deliveryPartners.inactive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.orders.total)}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-600">
                    Pending: {stats.orders.pending}
                  </span>
                  <span className="text-blue-600">
                    Processing: {stats.orders.processing}
                  </span>
                  <span className="text-green-600">
                    Delivered: {stats.orders.delivered}
                  </span>
                  <span className="text-red-600">
                    Cancelled: {stats.orders.cancelled}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  User Growth
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.userGrowth.totalUsers)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    New: {stats.userGrowth.newSignups}
                  </span>
                  <span className="text-blue-600">
                    Active: {stats.userGrowth.activeUsers}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue & Commission Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.revenue.today)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commission: {formatCurrency(stats.commission.today)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.revenue.thisWeek)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commission: {formatCurrency(stats.commission.thisWeek)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.revenue.thisMonth)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commission: {formatCurrency(stats.commission.thisMonth)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Year to Date
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.revenue.yearToDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commission: {formatCurrency(stats.commission.yearToDate)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Video Consultations & Live Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Video Consultations
                </CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.videoConsultations.completed)}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">
                    Ongoing: {stats.videoConsultations.ongoing}
                  </span>
                  <span>
                    Avg: {stats.videoConsultations.averageCallDuration}min
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Live System Stats
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Online Stores:</span>
                    <Badge variant="default">
                      {formatNumber(stats.liveStats.onlineStores)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Calls:</span>
                    <Badge variant="secondary">
                      {formatNumber(stats.liveStats.activeVideoCalls)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ongoing Deliveries:</span>
                    <Badge variant="outline">
                      {formatNumber(stats.liveStats.ongoingDeliveries)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Store Distribution
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {stats.stores.cityBreakdown.slice(0, 3).map((city) => (
                    <div
                      key={city.city}
                      className="flex justify-between text-xs"
                    >
                      <span>{city.city}:</span>
                      <span className="font-medium">
                        {formatNumber(city.count)}
                      </span>
                    </div>
                  ))}
                  <Button variant="link" className="text-xs p-0 h-auto">
                    View all cities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Top Performers Section */}
          {topPerformers && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Top Performing Companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.companies.map((company, index) => (
                      <div
                        key={company.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <div>
                            <div className="font-medium text-sm">
                              {company.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatNumber(company.orders)} orders
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {formatCurrency(company.revenue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Best-Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.products.map((product, index) => (
                      <div
                        key={product.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <div>
                            <div className="font-medium text-sm">
                              {product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatNumber(product.sold)} sold
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {formatCurrency(product.revenue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Engagement */}
              {customerEngagement && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Customer Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Video Calls Initiated</span>
                        <span className="font-bold">
                          {formatNumber(customerEngagement.videoCallsInitiated)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Chat Conversations</span>
                        <span className="font-bold">
                          {formatNumber(customerEngagement.chats)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Repeat Orders</span>
                        <span className="font-bold">
                          {formatNumber(customerEngagement.repeatOrders)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Order Value</span>
                        <span className="font-bold">
                          {formatCurrency(customerEngagement.averageOrderValue)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Performance */}
              {deliveryPerformance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Delivery Time</span>
                        <span className="font-bold">
                          {deliveryPerformance.averageDeliveryTime} days
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <Badge variant="default">
                          {deliveryPerformance.successRate}%
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">On-time Deliveries</span>
                        <span className="font-bold">
                          {formatNumber(deliveryPerformance.onTimeDeliveries)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm">Reassignments</span>
                        <span className="font-bold text-yellow-600">
                          {formatNumber(deliveryPerformance.reassignmentCount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Refunds & Returns */}
          {refundsReturns && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Refunds & Returns Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-2xl font-bold">
                      {formatNumber(refundsReturns.count)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Returns
                    </p>
                    <div className="text-lg font-semibold text-red-600 mt-1">
                      {formatCurrency(refundsReturns.value)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Reason Breakdown</h4>
                    {refundsReturns.reasonBreakdown.map((reason) => (
                      <div
                        key={reason.reason}
                        className="flex justify-between text-xs"
                      >
                        <span>{reason.reason}</span>
                        <div className="flex gap-2">
                          <span>{reason.count}</span>
                          <Badge variant="outline" className="text-xs">
                            {reason.percentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Promotions */}
          {promotionsData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Promotions & Spin-the-Wheel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatNumber(promotionsData.spinWheelUsage)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Spin Wheel Usage
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {promotionsData.conversionRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conversion Rate
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatNumber(promotionsData.totalPromotions)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Promotions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(promotionsData.activePromotions)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Promotions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          {/* Controls & Admin Tools */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Role & Permission Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Manage User Roles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Permission Matrix
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Access Control Lists
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Entity Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Company Approval
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Brand Verification
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Store Suspension
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Payment Gateways
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Tax Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Delivery Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Templates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Audit Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    System Health
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    User Activity Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Commission Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Payout Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Revenue Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Bulk Operations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Mass Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Emergency Controls
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    action: "New company registration",
                    user: "TechStyle Fashion",
                    time: "2 minutes ago",
                    type: "company",
                  },
                  {
                    action: "Store approval",
                    user: "Mumbai Central Store",
                    time: "5 minutes ago",
                    type: "store",
                  },
                  {
                    action: "Product bulk upload",
                    user: "Urban Chic Brand",
                    time: "12 minutes ago",
                    type: "product",
                  },
                  {
                    action: "Payment gateway update",
                    user: "System Admin",
                    time: "1 hour ago",
                    type: "system",
                  },
                  {
                    action: "KYC document submitted",
                    user: "Fashion Forward Ltd",
                    time: "2 hours ago",
                    type: "kyc",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          activity.type === "company"
                            ? "default"
                            : activity.type === "store"
                              ? "secondary"
                              : activity.type === "product"
                                ? "outline"
                                : activity.type === "system"
                                  ? "destructive"
                                  : "default"
                        }
                        className="w-2 h-2 p-0 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {activity.action}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.user}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
