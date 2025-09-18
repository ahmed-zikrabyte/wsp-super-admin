export interface IDashboard {
  totalUsers: number;
  usersJoinedLastWeek: number;
  totalProducts: number;
  totalProductsAddedLastWeek: number;
  totalSales: number;
  totalOrders: number;
  totalOrdersInLastWeek: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "blocked" | "active";
  createdAt: string;
}
export interface Product {
  _id: string;
  name: string;
  slug: string;
  images: {
    url: string;
    mimeType: string;
    publicKey: string;
  }[];
  variants: {
    size: string;
    price: string;
    weight: {
      square: string;
      circle: string;
      value: string;
    };
    _id: string;
    image?: {
      url: string;
      mimeType: string;
      publicKey: string;
    };
  }[];
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  category: string;
  sortProduct: number;
  healthBenefit: string[];
  nutritionValue: string;
  ingredient: string;
  howOurProductIsMade: string;
  haveShape: boolean;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Product[];

  address: {
    fullName: string;
    phone: string;
  };
  paymentId: string;
  coupon: {
    _id: string;
    code: string;
    discount: number;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status:
    | "pending"
    | "completed"
    | "cancelled"
    | "shipped"
    | "confirmed"
    | "pickup_scheduled";
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  shipment: {
    shipmentId: string;
    courierName: string;
    courierCompanyId: string;
    pickupScheduledDate: string;
    awbCode: string;
    awbNumber: string;
    awbUrl: string;
    createdAt: string;
    updatedAt: string;
  };
}
