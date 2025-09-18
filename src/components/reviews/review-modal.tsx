"use client";

import moment from "moment";
import Image from "next/image";
import { StatusBadge } from "@/components/badges/custom-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  customerName: string;
  userId: {
    name: string;
    email: string;
  };
  product: {
    productId: string;
    name: string;
    images: { url: string }[];
  };
  rating: number;
  review: string;
  status: string;
  createdAt: string;
  _id: string;
}

interface ReviewDetailsModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDetailsModal({
  review,
  isOpen,
  onClose,
}: ReviewDetailsModalProps) {
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-base font-medium">
                  {review.customerName || review.userId.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium">{review.userId.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              {review.product?.images?.length > 0 && (
                <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                  <Image
                    src={review.product.images[0].url}
                    alt={review.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Product Name</p>
                <p className="text-base font-medium">{review.product?.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Review Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Review Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating */}
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{review.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={review.status} />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-base font-medium">
                    {moment(review.createdAt).format("DD MMM YYYY")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {moment(review.createdAt).fromNow()}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <p className="text-sm text-muted-foreground">Review Text</p>
                <div className="mt-2 p-4 bg-muted/40 rounded-lg border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {review.review}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
