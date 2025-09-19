export interface DashboardStats {
  companies: {
    total: number;
    kycPending: number;
    kycApproved: number;
    kycRejected: number;
  };
  companyAdmins: {
    total: number;
    active: number;
    inactive: number;
  };
  brands: {
    total: number;
    active: number;
    inactive: number;
  };
  brandAdmins: {
    total: number;
    active: number;
    inactive: number;
  };
  categories: {
    total: number;
    subcategories: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  stores: {
    total: number;
    cityBreakdown: { city: string; count: number }[];
    pincodeBreakdown: { pincode: string; count: number }[];
  };
  storeManagers: {
    total: number;
    active: number;
    inactive: number;
  };
  storeExecutives: {
    total: number;
    active: number;
    inactive: number;
  };
  deliveryPartners: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    yearToDate: number;
  };
  commission: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    yearToDate: number;
  };
  userGrowth: {
    newSignups: number;
    activeUsers: number;
    totalUsers: number;
  };
  videoConsultations: {
    completed: number;
    ongoing: number;
    averageCallDuration: number;
  };
  liveStats: {
    onlineStores: number;
    activeVideoCalls: number;
    ongoingDeliveries: number;
  };
}

export interface TopPerformers {
  companies: { name: string; revenue: number; orders: number }[];
  brands: { name: string; revenue: number; orders: number }[];
  stores: { name: string; revenue: number; orders: number }[];
  products: { name: string; sold: number; revenue: number }[];
  categories: { name: string; sales: number; revenue: number }[];
}

export interface CustomerEngagement {
  videoCallsInitiated: number;
  chats: number;
  repeatOrders: number;
  averageOrderValue: number;
}

export interface DeliveryPerformance {
  averageDeliveryTime: number;
  successRate: number;
  reassignmentCount: number;
  onTimeDeliveries: number;
}

export interface RefundsReturns {
  count: number;
  value: number;
  reasonBreakdown: { reason: string; count: number; percentage: number }[];
}

export interface PromotionsData {
  spinWheelUsage: number;
  conversionRate: number;
  totalPromotions: number;
  activePromotions: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    companies: {
      total: 245,
      kycPending: 23,
      kycApproved: 198,
      kycRejected: 24,
    },
    companyAdmins: {
      total: 312,
      active: 289,
      inactive: 23,
    },
    brands: {
      total: 1428,
      active: 1341,
      inactive: 87,
    },
    brandAdmins: {
      total: 1654,
      active: 1523,
      inactive: 131,
    },
    categories: {
      total: 89,
      subcategories: 456,
    },
    products: {
      total: 25847,
      active: 23951,
      inactive: 1896,
    },
    stores: {
      total: 3421,
      cityBreakdown: [
        { city: "Mumbai", count: 652 },
        { city: "Delhi", count: 587 },
        { city: "Bangalore", count: 493 },
        { city: "Chennai", count: 421 },
        { city: "Hyderabad", count: 398 },
        { city: "Pune", count: 356 },
        { city: "Kolkata", count: 289 },
        { city: "Others", count: 225 },
      ],
      pincodeBreakdown: [
        { pincode: "400001", count: 89 },
        { pincode: "110001", count: 76 },
        { pincode: "560001", count: 65 },
        { pincode: "600001", count: 54 },
        { pincode: "500001", count: 43 },
      ],
    },
    storeManagers: {
      total: 3421,
      active: 3298,
      inactive: 123,
    },
    storeExecutives: {
      total: 8945,
      active: 8634,
      inactive: 311,
    },
    deliveryPartners: {
      total: 15673,
      active: 14231,
      inactive: 1442,
    },
    orders: {
      total: 458372,
      pending: 2341,
      processing: 5687,
      delivered: 442891,
      cancelled: 5234,
      returned: 2219,
    },
    revenue: {
      today: 2847362,
      thisWeek: 18945621,
      thisMonth: 76234891,
      yearToDate: 945782134,
    },
    commission: {
      today: 142368,
      thisWeek: 947281,
      thisMonth: 3811745,
      yearToDate: 47289107,
    },
    userGrowth: {
      newSignups: 1247,
      activeUsers: 89453,
      totalUsers: 245789,
    },
    videoConsultations: {
      completed: 12847,
      ongoing: 234,
      averageCallDuration: 18.5,
    },
    liveStats: {
      onlineStores: 2847,
      activeVideoCalls: 234,
      ongoingDeliveries: 5687,
    },
  };
};

export const getTopPerformers = async (): Promise<TopPerformers> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    companies: [
      { name: "TechStyle Fashion", revenue: 15847293, orders: 12847 },
      { name: "StyleHub India", revenue: 12934576, orders: 9876 },
      { name: "Fashion Forward", revenue: 9876543, orders: 8234 },
      { name: "Trendy Bazaar", revenue: 8765432, orders: 7123 },
      { name: "Modern Wardrobe", revenue: 7654321, orders: 6234 },
    ],
    brands: [
      { name: "Urban Chic", revenue: 8947561, orders: 7234 },
      { name: "Classic Wear", revenue: 7856342, orders: 6543 },
      { name: "Street Style", revenue: 6745231, orders: 5432 },
      { name: "Elegant Touch", revenue: 5634120, orders: 4321 },
      { name: "Modern Threads", revenue: 4523019, orders: 3210 },
    ],
    stores: [
      { name: "Mumbai Central Store", revenue: 2847192, orders: 2341 },
      { name: "Delhi Fashion Hub", revenue: 2456783, orders: 2098 },
      { name: "Bangalore Style Center", revenue: 2234567, orders: 1876 },
      { name: "Chennai Fashion Plaza", revenue: 1987654, orders: 1654 },
      { name: "Hyderabad Trends", revenue: 1765432, orders: 1432 },
    ],
    products: [
      { name: "Designer Kurta Set", sold: 2847, revenue: 1423567 },
      { name: "Casual Denim Jacket", sold: 2341, revenue: 1284732 },
      { name: "Ethnic Saree Collection", sold: 2098, revenue: 1156890 },
      { name: "Formal Shirt Combo", sold: 1876, revenue: 987654 },
      { name: "Traditional Lehenga", sold: 1654, revenue: 876543 },
    ],
    categories: [
      { name: "Women's Ethnic Wear", sales: 45632, revenue: 12847293 },
      { name: "Men's Casual Wear", sales: 38947, revenue: 9876543 },
      { name: "Kids Fashion", sales: 28456, revenue: 7654321 },
      { name: "Accessories", sales: 19876, revenue: 5432109 },
      { name: "Footwear", sales: 15234, revenue: 4321098 },
    ],
  };
};

export const getCustomerEngagement = async (): Promise<CustomerEngagement> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    videoCallsInitiated: 18947,
    chats: 45632,
    repeatOrders: 28456,
    averageOrderValue: 2847,
  };
};

export const getDeliveryPerformance =
  async (): Promise<DeliveryPerformance> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      averageDeliveryTime: 2.8,
      successRate: 96.7,
      reassignmentCount: 1247,
      onTimeDeliveries: 442891,
    };
  };

export const getRefundsReturns = async (): Promise<RefundsReturns> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    count: 2219,
    value: 5647392,
    reasonBreakdown: [
      { reason: "Size Issues", count: 887, percentage: 40 },
      { reason: "Quality Issues", count: 443, percentage: 20 },
      { reason: "Color Mismatch", count: 332, percentage: 15 },
      { reason: "Damaged in Transit", count: 266, percentage: 12 },
      { reason: "Wrong Item", count: 177, percentage: 8 },
      { reason: "Others", count: 114, percentage: 5 },
    ],
  };
};

export const getPromotionsData = async (): Promise<PromotionsData> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    spinWheelUsage: 15847,
    conversionRate: 23.4,
    totalPromotions: 189,
    activePromotions: 47,
  };
};
