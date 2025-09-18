"use client";
import { ChefHat, Heart, Info, Leaf, Package } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/badges/custom-badge";
import { ImageGalleryModal } from "@/components/global/image-gallery";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug } from "@/services/productService";
import type { Product } from "@/typing";

const ProductDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const [productData, setProduct] = useState<Product | null>(null);

  const fetchProductBySlug = async (slug: string) => {
    try {
      const response = await getProductBySlug(slug);
      console.log(response, "product");
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product by slug:", error);
    }
  };

  useEffect(() => {
    fetchProductBySlug(slug);
  }, [slug]);

  const tabs = [
    {
      id: "description",
      label: "Description",
      icon: <Info className="w-4 h-4" />,
      content: productData?.description,
    },
    {
      id: "nutrition",
      label: "Nutrition Value",
      icon: <Leaf className="w-4 h-4" />,
      content: productData?.nutritionValue,
    },
    {
      id: "ingredients",
      label: "Ingredients",
      icon: <Package className="w-4 h-4" />,
      content: productData?.ingredient,
    },
    {
      id: "manufacturing",
      label: "How It's Made",
      icon: <ChefHat className="w-4 h-4" />,
      content: productData?.howOurProductIsMade,
    },
    {
      id: "variants",
      label: "Variants",
      icon: <Package className="w-4 h-4" />,
      content: null, // Special handling for variants
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 ">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {productData?.name}
            </h1>
            <StatusBadge status={(productData?.status as string) || ""} />
          </div>
          {/* Health Benefits */}
          <div className="flex flex-wrap gap-2 mb-4">
            {productData?.healthBenefit.map((benefit, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                {benefit}
              </Badge>
            ))}
          </div>
          {/* Product Image Placeholder */}

          {productData && productData?.images?.length > 0 ? (
            <>
              {/* Responsive Image Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {productData.images.map((image, index) => (
                    <div
                      key={`${image.publicKey}-${index}`}
                      className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setIsOpen(true);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={`${productData.name} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        priority={index < 5} // Prioritize first 5 images
                      />

                      {/* Image number badge */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        {index + 1}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image count info */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {productData.images.length} image
                    {productData.images.length !== 1 ? "s" : ""} • Click to view
                    gallery
                  </p>
                </div>
              </div>

              {/* Image Gallery Modal */}
              <ImageGalleryModal
                images={productData.images.map((image) => image.url)}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialIndex={selectedImageIndex}
                alt={`${productData.name} Gallery`}
              />
            </>
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No images available</p>
              </div>
            </div>
          )}
        </div>
        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Comprehensive information about {productData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {tab.icon}
                      {tab.label}
                    </h3>

                    {tab.id === "variants" ? (
                      <div className="space-y-4">
                        {productData?.variants.map((variant) => (
                          <Card key={variant?._id} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600">
                                  Size (ml)
                                </span>
                                <span className="text-lg font-semibold">
                                  {variant.size}
                                </span>
                              </div>
                              {productData.haveShape ? (
                                <>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Weight (Square) gm
                                    </span>
                                    <span className="text-lg font-semibold">
                                      {variant.weight.square}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Weight (Circle) gm
                                    </span>
                                    <span className="text-lg font-semibold">
                                      {variant.weight.circle}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-600">
                                    Weight (gm)
                                  </span>
                                  <span className="text-lg font-semibold">
                                    {variant.weight.value}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600">
                                  Price
                                </span>
                                <span className="text-lg font-semibold text-green-600">
                                  ₹{variant.price}
                                </span>
                              </div>
                              {variant.image && (
                                <div className="relative w-40 h-40">
                                  <Image
                                    src={variant?.image?.url}
                                    fill
                                    alt={variant?.image.publicKey}
                                    className="object-cover rounded-md"
                                  />
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="prose prose-gray max-w-none">
                        <p
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: tab.content as string,
                          }}
                        ></p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Created: {formatDate(productData?.createdAt as string)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
