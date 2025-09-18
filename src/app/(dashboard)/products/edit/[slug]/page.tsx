"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ConfirmationModal from "@/components/global/confirmation-modal";
import { TiptapEditor } from "@/components/text-editor/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getCategories } from "@/services/categoryService";
import { getProductBySlug, updateProduct } from "@/services/productService";
import type { Category } from "@/typing";

// Types for existing images
interface ExistingImage {
  url: string;
  mimeType: string;
  publicKey: string;
  _id?: string;
}

interface ProductVariant {
  size: string;
  price: string | number;
  weight: {
    square: string;
    circle: string;
    value: string;
  };
  _id?: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  category: string | { _id: string; name: string };
  sortProduct: number;
  healthBenefit: string[];
  nutritionValue: string;
  ingredient: string;
  howOurProductIsMade: string;
  variants: ProductVariant[];
  images: ExistingImage[];
}

const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d*\.?\d{0,2}$/, "Invalid price format"),
  weight: z.object({
    square: z.string().optional(),
    circle: z.string().optional(),
    value: z.string().optional(),
  }),
  image: z.any(), // <-- make image optional
  _id: z.string().optional(),
});

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  });

const formSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    category: z.string().min(1, "Category is required"),
    sortProduct: z
      .string()
      .min(1, "Sort position is required")
      .refine(
        (val) => {
          const num = parseInt(val);
          return !isNaN(num) && num > 0;
        },
        {
          message: "Sort position must be a positive number",
        }
      ),
    healthBenefit: z
      .array(z.string())
      .min(1, "At least one health benefit is required"),
    nutritionValue: z.string().min(1, "Nutrition value is required"),
    ingredient: z.string().min(1, "Ingredients are required"),
    howOurProductIsMade: z
      .string()
      .min(1, "Product making process is required"),
    newImages: z.array(imageSchema).default([]),
    haveShape: z.boolean({ message: "Shape needs to be selected" }),
  })
  .superRefine((data, ctx) => {
    data.variants.forEach((variant, index) => {
      if (data.haveShape) {
        // require square + circle
        if (!variant.weight.square || !variant.weight.circle) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "weight"],
            message:
              "Square and Circle weights are required when shape is enabled",
          });
        }
      } else {
        // require single value
        if (!variant.weight.value) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "weight", "value"],
            message: "Weight is required when shape is disabled",
          });
        }
      }
    });
  });

type ProductFormData = {
  name: string;
  description: string;
  variants: {
    image: File;
    size: string;
    price: string;
    weight: { square: string; circle: string; value: string };
    _id: string;
  }[];
  category: string;
  sortProduct: string;
  healthBenefit: string[];
  nutritionValue: string;
  ingredient: string;
  howOurProductIsMade: string;
  newImages: File[];
  haveShape: boolean;
};

export default function ProductEditForm() {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [healthBenefitInput, setHealthBenefitInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<ProductData | null>(null);

  // Image management
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState<{
    [key: string]: string; // key = variant._id or index
  }>({});
  const [deletedVariantImages, setDeletedVariantImages] = useState<any[]>([]);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      variants: [
        {
          size: "",
          price: "",
          weight: { square: "", circle: "" },
          image: File,
        },
      ],
      category: "",
      sortProduct: "",
      healthBenefit: [],
      nutritionValue: "",
      ingredient: "",
      howOurProductIsMade: "",
      newImages: [],
      haveShape: false,
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    if (!slug) {
      toast.error("Product slug is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getProductBySlug(slug);
      const product = response.data?.data || response.data;

      if (!product) {
        toast.error("Product not found");
        setLoading(false);
        return;
      }

      setProductData(product);
      console.log(product);
      setExistingImages(product.images || []);

      // Handle category - it might be populated object or just ID
      const categoryId =
        typeof product.category === "object"
          ? product.category._id
          : product.category;

      // Process variants to ensure all fields are strings
      const processedVariants =
        Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((variant: ProductVariant) => ({
              ...variant,
              price: String(variant.price || ""), // Convert to string
              size: String(variant.size || ""),
              weight: {
                square: String(variant.weight.square || ""),
                circle: String(variant.weight.circle || ""),
                value: String(variant.weight.value || ""),
              },
              _id: variant._id, // Keep _id as is
            }))
          : [
              {
                size: "",
                price: "",
                weight: { square: "", circle: "", value: "" },
              },
            ];

      // Set form values with proper validation
      form.reset({
        name: product.name || "",
        description: product.description || "",
        category: categoryId || "",
        sortProduct: String(product.sortProduct || ""),
        healthBenefit: Array.isArray(product.healthBenefit)
          ? product.healthBenefit
          : [],
        nutritionValue: product.nutritionValue || "",
        ingredient: product.ingredient || "",
        howOurProductIsMade: product.howOurProductIsMade || "",
        variants: processedVariants,
        newImages: [],
        haveShape: product.haveShape || false,
      });
    } catch (error: any) {
      console.error("Error fetching product:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load product data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug, form]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Create stable URLs for new images
  const stableNewImageUrls = useMemo(() => {
    const newImages = form.watch("newImages") || [];
    if (newImages.length === 0) return [];

    // Clean up old URLs
    newImageUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    // Create new URLs
    const urls = newImages.map((file: any) => URL.createObjectURL(file));
    setNewImageUrls(urls);
    return urls;
  }, [form.watch("newImages")]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      newImageUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [newImageUrls]);

  const addHealthBenefit = useCallback(() => {
    if (healthBenefitInput.trim()) {
      const currentBenefits = form.getValues("healthBenefit") || [];
      form.setValue("healthBenefit", [
        ...currentBenefits,
        healthBenefitInput.trim(),
      ]);
      setHealthBenefitInput("");
    }
  }, [healthBenefitInput, form]);

  const removeHealthBenefit = useCallback(
    (index: number) => {
      const currentBenefits = form.getValues("healthBenefit") || [];
      form.setValue(
        "healthBenefit",
        currentBenefits.filter((_: any, i: number) => i !== index)
      );
    },
    [form]
  );

  const handleRemoveExistingImage = useCallback(
    (index: number) => {
      const imageToRemove = existingImages[index];
      if (imageToRemove?._id) {
        setDeletedImageIds((prev) => [...prev, imageToRemove._id!]);
      }
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    },
    [existingImages]
  );

  const handleRemoveNewImage = useCallback(
    (index: number) => {
      const currentImages = form.getValues("newImages") || [];
      const updatedImages = [...currentImages];

      // Revoke the URL for the removed image
      if (stableNewImageUrls[index]) {
        URL.revokeObjectURL(stableNewImageUrls[index]);
      }

      updatedImages.splice(index, 1);
      form.setValue("newImages", updatedImages);
    },
    [form, stableNewImageUrls]
  );

  const handleNewImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const currentNewImages = form.getValues("newImages") || [];
      const totalImages =
        existingImages.length + currentNewImages.length + files.length;

      // Validate total image count
      if (totalImages > 5) {
        toast.error(
          `You can only have a maximum of 5 images. Currently you have ${existingImages.length} existing images.`
        );
        e.target.value = "";
        return;
      }

      // Validate file types
      const invalidFiles = files.filter(
        (file) => !file.type.startsWith("image/")
      );
      if (invalidFiles.length > 0) {
        toast.error("Only image files are allowed");
        e.target.value = "";
        return;
      }

      // Validate file sizes
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = files.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        toast.error("Some files are too large. Maximum size is 5MB per image.");
        e.target.value = "";
        return;
      }

      // Add new images to existing new images
      form.setValue("newImages", [...currentNewImages, ...files]);

      // Reset the input
      e.target.value = "";
    },
    [form, existingImages.length]
  );

  // Calculate total images
  const totalImageCount =
    existingImages.length + (form.watch("newImages")?.length || 0);

  const onSubmit = async (data: ProductFormData) => {
    console.log("Form data:", data);

    // Validate total image count
    if (totalImageCount < 5) {
      toast.error("5 images is required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("description", data.description);
      formDataToSend.append("category", data.category);
      formDataToSend.append("sortProduct", data.sortProduct);
      formDataToSend.append(
        "healthBenefit",
        JSON.stringify(data.healthBenefit)
      );
      formDataToSend.append("nutritionValue", data.nutritionValue);
      formDataToSend.append("ingredient", data.ingredient);
      formDataToSend.append("howOurProductIsMade", data.howOurProductIsMade);
      const variantsMeta = data.variants.map(({ ...rest }) => rest);
      formDataToSend.append("variants", JSON.stringify(variantsMeta));
      formDataToSend.append("haveShape", JSON.stringify(data.haveShape));

      const variantImages: File[] = [];
      const variantIds: string[] = [];

      // attach variant images separately with their IDs
      data.variants.forEach((variant, _index) => {
        // Check if image is a File and has required properties
        if (
          variant.image &&
          typeof variant.image === "object" &&
          "lastModified" in variant.image &&
          "name" in variant.image &&
          "size" in variant.image &&
          "type" in variant.image &&
          variant.image instanceof File
        ) {
          variantImages.push(variant.image);
          variantIds.push(variant._id);
        }
      });
      variantImages.forEach((file) => {
        formDataToSend.append("newVariantImages", file);
      });
      formDataToSend.append("variantIds", JSON.stringify(variantIds));

      formDataToSend.append(
        "deletedVariantImages",
        JSON.stringify(deletedVariantImages)
      );

      // Add existing images that are not deleted
      const remainingExistingImages = existingImages.filter(
        (img) => !deletedImageIds.includes(img._id || "")
      );
      formDataToSend.append(
        "existingImages",
        JSON.stringify(remainingExistingImages)
      );

      // Add deleted image IDs
      formDataToSend.append("deletedImages", JSON.stringify(deletedImageIds));

      // Add new images
      const newImages = data.newImages || [];
      newImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      console.log(formDataToSend);

      const response = await updateProduct(slug, formDataToSend);
      console.log("Product updated:", response);
      toast.success(response.message || "Product updated successfully");
      router.push("/products?type=products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update product. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading product data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-red-500">Failed to load product data</p>
              <Button onClick={fetchProductData} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update the product details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => setOpen(true))}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortProduct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter sort position (e.g., 1, 2, 3...)"
                          {...field}
                          onChange={(e) => {
                            // Only allow positive integers
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="haveShape"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Has Shape?</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable this if the product has shape-specific weights.
                        </p>
                        {field.value}
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);

                            // Reset all weights when switching mode
                            const variants = form.getValues("variants");
                            variants.forEach((_: any, index: number) => {
                              if (checked) {
                                // Shape enabled → clear `value`, keep square/circle empty
                                form.setValue(`variants.${index}.weight`, {
                                  square:
                                    productData.variants[index].weight.square ||
                                    "",
                                  circle:
                                    productData.variants[index].weight.circle ||
                                    "",
                                  value: undefined,
                                });
                              } else {
                                // Shape disabled → clear square/circle, keep single value
                                form.setValue(`variants.${index}.weight`, {
                                  square: undefined,
                                  circle: undefined,
                                  value:
                                    productData.variants[index].weight.value ||
                                    "",
                                });
                              }
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Health Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div className="space-y-4">
                  <FormLabel>Health Benefits</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter health benefit"
                      value={healthBenefitInput}
                      onChange={(e) => setHealthBenefitInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHealthBenefit();
                        }
                      }}
                    />
                    <Button
                      className="cursor-pointer"
                      type="button"
                      onClick={addHealthBenefit}
                      disabled={!healthBenefitInput.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  <ul className="list-disc pl-5 space-y-1">
                    {(form.watch("healthBenefit") || []).map(
                      (benefit: any, index: any) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span>{benefit}</span>
                          <button
                            type="button"
                            className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => removeHealthBenefit(index)}
                          >
                            ×
                          </button>
                        </li>
                      )
                    )}
                  </ul>

                  {form.formState.errors.healthBenefit && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.healthBenefit.message as string}
                    </p>
                  )}
                </div> */}

                <div className="space-y-4">
                  <FormLabel>Health Benefits</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter health benefit"
                      value={healthBenefitInput}
                      onChange={(e) => setHealthBenefitInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHealthBenefit();
                        }
                      }}
                    />
                    <Button
                      disabled={healthBenefitInput === ""}
                      className="cursor-pointer"
                      type="button"
                      onClick={addHealthBenefit}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="flex flex-wrap gap-2 mt-2">
                    {form
                      .watch("healthBenefit")
                      .map((benefit: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center max-w-xs bg-gray-100 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-200 transition"
                          title={benefit} // shows full text on hover
                        >
                          <span className="text-gray-700 truncate max-w-[140px]">
                            {benefit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeHealthBenefit(index)}
                            className="ml-2 text-gray-500 hover:text-red-500 transition"
                          >
                            <X className="w-4 h-4 shrink-0" />
                          </button>
                        </li>
                      ))}
                  </ul>
                  {form.formState.errors.healthBenefit && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.healthBenefit.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Product Variants</FormLabel>
                    {/* Add More button always visible at the top */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        appendVariant({ size: "", price: "", weight: "" })
                      }
                      className=" transition"
                    >
                      + Add More
                    </Button>
                  </div>

                  {variantFields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                      {/* Show remove button on all cards except when there's only one */}
                      {index > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="absolute cursor-pointer top-2 right-2 w-6 h-6 text-red-500 hover:text-red-700 transition"
                          title="Remove Variant"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.size`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volume (ML)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 100, 250, 500, 1000"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    );
                                    field.onChange(value);
                                  }}
                                  onKeyPress={(e) => {
                                    if (
                                      !/[0-9.]/.test(e.key) &&
                                      e.key !== "Backspace" &&
                                      e.key !== "Delete"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("haveShape") ? (
                          <>
                            <FormField
                              control={form.control}
                              name={`variants.${index}.weight.square`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight (Square) (gm)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 500"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`variants.${index}.weight.circle`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight (Circle) (gm)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 500"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <FormField
                            control={form.control}
                            name={`variants.${index}.weight.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (gm)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 500"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 19.99"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                      /^\d*\.?\d{0,2}$/.test(value) ||
                                      value === ""
                                    ) {
                                      field.onChange(value);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.image`}
                          render={({ field }) => (
                            <>
                              <FormItem className="md:col-span-2">
                                <FormLabel>Variant Image</FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    {/* Upload Area */}
                                    <label
                                      htmlFor={`variant-file-upload-${index}`}
                                    >
                                      <div className="border border-dashed w-full border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <p className="text-sm text-muted-foreground">
                                          Click to upload an image
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {field.value
                                            ? "1 / 1 image selected"
                                            : "No image selected"}
                                        </p>
                                      </div>
                                      <Input
                                        id={`variant-file-upload-${index}`}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;

                                          // update form value
                                          field.onChange(file);

                                          // generate preview key
                                          const key =
                                            field.value?._id || String(index);
                                          const previewUrl =
                                            URL.createObjectURL(file);

                                          setVariantImagePreviews((prev) => ({
                                            ...prev,
                                            [key]: previewUrl,
                                          }));
                                        }}
                                      />
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                              {/* Image Preview with remove */}
                              {(() => {
                                const key = field.value?._id || String(index);
                                const previewUrl = variantImagePreviews[key];

                                if (previewUrl) {
                                  return (
                                    <div className="relative w-fit">
                                      <Image
                                        src={previewUrl}
                                        alt="Variant Preview"
                                        width={120}
                                        height={120}
                                        className="w-full h-40 object-cover rounded"
                                        unoptimized
                                      />
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => {
                                          // Clear the field
                                          field.onChange(null);

                                          // If preview was created, revoke and remove it
                                          if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                            setVariantImagePreviews((prev) => {
                                              const updated = { ...prev };
                                              delete updated[key];
                                              return updated;
                                            });
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  );
                                } else if (field.value) {
                                  // existing image from backend
                                  return (
                                    <div className="relative w-fit">
                                      <Image
                                        src={field.value.url}
                                        alt="Existing Variant Image"
                                        width={200}
                                        height={200}
                                        className="w-full h-40 object-cover rounded"
                                      />
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => {
                                          // If existing image (from backend), track it in deletedVariantImages
                                          if (
                                            typeof field.value === "object" &&
                                            field.value?.url
                                          ) {
                                            setDeletedVariantImages((prev) => [
                                              ...prev,
                                              field.value.url,
                                            ]);
                                          }

                                          // Clear the field
                                          field.onChange(null);

                                          // If preview was created, revoke and remove it
                                          if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                            setVariantImagePreviews((prev) => {
                                              const updated = { ...prev };
                                              delete updated[key];
                                              return updated;
                                            });
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Product Details */}
                <div>
                  <div className="self-start">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <TiptapEditor
                              content={field.value}
                              onChange={field.onChange}
                              disabled={form.formState.isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="ingredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={field.value}
                          onChange={(value) => field.onChange(value)}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="howOurProductIsMade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How Our Product Is Made</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={field.value}
                          onChange={(value) => field.onChange(value)}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nutritionValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nutrition Value</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={field.value}
                          onChange={(value) => field.onChange(value)}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <div>
                  <FormLabel className="text-lg">Product Images</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Total images: {totalImageCount} / 5 (minimum 5 required)
                  </p>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Existing Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {existingImages.map((image, index) => (
                        <Card
                          key={`existing-${image._id || index}`}
                          className="p-2 relative"
                        >
                          <Image
                            width={200}
                            height={200}
                            src={image.url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-40 object-cover rounded"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => handleRemoveExistingImage(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <p className="text-xs text-center mt-1 text-blue-600">
                            Existing
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                {totalImageCount < 5 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Add New Images</h4>
                    <label htmlFor="new-file-upload">
                      <div className="border border-dashed w-md border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-muted-foreground">
                          Click to upload new images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You can add {5 - totalImageCount} more image(s)
                        </p>
                      </div>
                      <Input
                        id="new-file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleNewImageChange}
                      />
                    </label>
                  </div>
                )}

                {/* New Images Preview */}
                {(form.watch("newImages")?.length || 0) > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">New Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {stableNewImageUrls.map((url: any, index: any) => {
                        const newImages = form.watch("newImages") || [];
                        return (
                          <Card
                            key={`new-${index}-${newImages[index]?.name}`}
                            className="p-2 relative"
                          >
                            <Image
                              width={200}
                              height={200}
                              src={url}
                              alt={`New ${index + 1}`}
                              className="w-full h-40 object-cover rounded"
                              unoptimized
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleRemoveNewImage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                            <p className="text-xs text-center mt-1 text-green-600">
                              New
                            </p>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  size="lg"
                >
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => await onSubmit(form.getValues())}
        title="Edit Product"
        description="Are you sure you want to edit the product?"
      />
    </div>
  );
}
