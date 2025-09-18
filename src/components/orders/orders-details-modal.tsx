import { Download, EyeIcon, FileText } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { StatusBadge } from "@/components/badges/custom-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { generateDocument } from "@/services/orderService";
import { Button } from "../ui/button";

// Define types based on the provided JSON structure
interface User {
  _id: string;
  email: string;
  phone: string;
  name: string;
}

interface Variant {
  size: string;
  price: number;
  weight: {
    square: string;
    circle: string;
  };
  _id: string;
}

interface ProductImage {
  url: string;
  mimeType: string;
  publicKey: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  variants: Variant[];
  category: string;
  healthBenefit: string[];
  nutritionValue: string;
  ingredient: string;
  howOurProductIsMade: string;
  images: ProductImage[];
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  variant: Variant;
  productId: Product;
  productName: string;
  slug: string;
  images: ProductImage[];
  shape: string;
  quantity: number;
  totalPrice: number;
  _id: string;
}

interface Address {
  userId: string;
  fullName: string;
  phone: string;
  pincode: string;
  state: string;
  district: string;
  house: string;
  area: string;
  landmark: string;
  addressType: string;
  isDefault: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Shipment {
  shippingCharge: number;
  shipmentId: string;
  shiprocketOrderId: string;
  awbCode: string;
  trackingUrl: string;
  courierCompanyId: number;
  courierName: string;
  pickupLocation: string;
  shipmentCreatedAt: string;
  pickupScheduledDate: string;
  manifestUrl: string;
  invoiceUrl: string;
  labelUrl: string;
}

export interface Order {
  _id: string;
  orderId: string;
  shipment?: Shipment;
  userId: User;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentId: string;
  paymentStatus: string;
  coupon: null | any;
  paymentMethod: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailsModalProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("order-details");

  // const handleDocumentDownload = async (documentType: string) => {
  //   try {
  //     const response = await generateDocument(order, documentType);

  //     let fileUrl = "";
  //     if (documentType === "invoice") {
  //       fileUrl = response.data.invoice_url;
  //     } else if (documentType === "manifest") {
  //       fileUrl = response.data.manifest_url;
  //     } else if (documentType === "label") {
  //       fileUrl = response.data.label_url;
  //     }

  //     if (!fileUrl) {
  //       toast.error("File URL not found");
  //       return;
  //     }

  //     // Open in new tab with force download
  //     const link = document.createElement("a");
  //     link.href = fileUrl;
  //     link.setAttribute("download", `${documentType}.pdf`);
  //     link.setAttribute("target", "_blank");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || "Something went wrong");
  //   }
  // };

  const handleDirectDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;

    if (filename === "awb-label.pdf") {
      // Just open in new tab for AWB label
      link.setAttribute("target", "_blank");
    } else {
      // Download for all other files
      link.setAttribute("download", filename);
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold">
            Order Details: {order.orderId}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Detailed information about your order and shipment.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
            <TabsTrigger value="order-details">Order Details</TabsTrigger>
            <TabsTrigger value="shipment-details">Shipment Details</TabsTrigger>
          </TabsList>

          <TabsContent
            value="order-details"
            className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
          >
            {/* Order Summary */}
            <Card className="border gap-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Order ID:</span>
                  <span className="text-sm font-mono">{order.orderId}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Total Amount:</span>
                  <span className="text-sm font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Payment Status:</span>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Payment Method:</span>
                  <span className="text-sm capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-sm">Order Date:</span>
                  <span className="text-sm">
                    {moment(order.createdAt).format("DD-MM-YYYY")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Order Items */}
            <Card className="border gap-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item._id}>
                      <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={
                              item.images?.[0]?.url ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="rounded-md object-cover border"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="font-medium text-base leading-tight">
                            {item.productName}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Size:</span>
                              <Badge variant="outline" className="text-xs">
                                {item.variant.size} ml
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Weight:</span>
                              <Badge variant="outline" className="text-xs">
                                {
                                  item.variant.weight[
                                    item.shape as keyof typeof item.variant.weight
                                  ]
                                }{" "}
                                g
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Quantity:</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.quantity}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Unit Price:</span>
                              <span className="text-xs">
                                ₹{item.variant.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {item.shape !== "value" && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Shape:</span>{" "}
                              {item.shape}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-semibold text-lg">
                            ₹{item.totalPrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total
                          </div>
                        </div>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex flex-col md:flex-row space-y-6 md:gap-4">
              {/* Shipping Address */}
              <Card className="border shadow-sm gap-2 w-full md:w-1/2 h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1 leading-relaxed">
                    <p className="font-medium">{order.address.fullName}</p>
                    <p>{order.address.phone}</p>
                    <p>
                      {order.address.house}, {order.address.area}
                      {order.address.landmark && `, ${order.address.landmark}`}
                    </p>
                    <p>
                      {order.address.district}, {order.address.state} -{" "}
                      <span className="font-mono">{order.address.pincode}</span>
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {order.address.addressType}
                    </Badge>
                    {order.address.isDefault && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Default Address
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Separator orientation="horizontal" className="md:hidden" />

              {/* Customer Information */}
              <Card className="border gap-2 shadow-sm w-full md:w-1/2 h-min">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 leading-relaxed">
                  <p>{order.userId.name}</p>
                  <p>{order.userId.email}</p>
                  <p>{order.userId.phone}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent
            value="shipment-details"
            className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
          >
            {order.shipment ? (
              <>
                {/* Shipment Summary */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Shipment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Shipment ID:</span>
                      <span className="text-sm font-mono">
                        {order.shipment.shipmentId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Shiprocket Order ID:
                      </span>
                      <span className="text-sm font-mono">
                        {order.shipment.shiprocketOrderId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">AWB Code:</span>
                      <span className="text-sm font-mono">
                        {order.shipment.awbCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Shipping Charge:
                      </span>
                      <span className="text-sm font-semibold">
                        ₹{order.shipment.shippingCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Courier:</span>
                      <span className="text-sm">
                        {order.shipment.courierName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Pickup Location:
                      </span>
                      <span className="text-sm">
                        {order.shipment.pickupLocation}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Shipment Timeline */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Shipment Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Shipment Created:
                      </span>
                      <span className="text-sm">
                        {moment(order.shipment.shipmentCreatedAt).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Pickup Scheduled:
                      </span>
                      <span className="text-sm">
                        {moment(order.shipment.pickupScheduledDate).format(
                          "DD-MM-YYYY"
                        )}
                      </span>
                    </div>
                    {order.shipment.trackingUrl && (
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-sm">
                          Track Shipment:
                        </span>
                        <a
                          href={order.shipment.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Track Package
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Separator />

                {/* Document Files */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Shipping Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.shipment.invoiceUrl ||
                    order.shipment.manifestUrl ||
                    order.shipment.labelUrl ? (
                      <div className="space-y-3">
                        {/* Invoice Document */}
                        {order.shipment.invoiceUrl ? (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Invoice</h4>
                                <p className="text-xs text-muted-foreground">
                                  PDF Document
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDirectDownload(
                                    order.shipment!.invoiceUrl,
                                    "invoice.pdf"
                                  )
                                }
                                className="flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/5 opacity-60">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  Invoice
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Not available
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          </div>
                        )}

                        {/* Manifest Document */}
                        {order.shipment.manifestUrl ? (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  Manifest
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  PDF Document
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDirectDownload(
                                    order.shipment!.manifestUrl,
                                    "manifest.pdf"
                                  )
                                }
                                className="flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/5 opacity-60">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  Manifest
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Not available
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          </div>
                        )}

                        {/* AWB Label Document */}
                        {order.shipment.labelUrl ? (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  AWB Label
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  PDF Document
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDirectDownload(
                                    order.shipment!.labelUrl,
                                    "awb-label.pdf"
                                  )
                                }
                                className="flex items-center gap-1"
                              >
                                <EyeIcon className="w-3 h-3" />
                                View
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/5 opacity-60">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  AWB Label
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Not available
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                          No Documents Available
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Shipping documents will appear here once generated.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Shipment Info */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">
                        Courier Company ID:
                      </span>
                      <span className="text-sm font-mono">
                        {order.shipment.courierCompanyId}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border shadow-sm">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-muted-foreground">
                      No Shipment Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Shipment details will appear here once the order is
                      shipped.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bottom spacing */}
            <div className="h-4" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
