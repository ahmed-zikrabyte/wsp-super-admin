"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
import { createProduct } from "@/services/productService";
import { useStatsStore } from "@/store/side.stats";
import type { Category } from "@/typing";

const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.string().min(1, "Price must be greater than 0"),

  weight: z.object({
    square: z.string().optional(),
    circle: z.string().optional(),
    value: z.string().optional(),
  }),

  image: z.any().refine((file) => file instanceof File, {
    message: "Image file is required",
  }),
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
    images: z.array(imageSchema).length(5, "Exactly 5 images are required"),
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

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [healthBenefitInput, setHealthBenefitInput] = useState("");

  // Store image URLs to prevent flickering
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [variantImageUrls, setVariantImageUrls] = useState<
    Record<number, string>
  >({});

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      variants: [
        {
          size: "",
          price: "",
          weight: { square: "", circle: "", value: "" },
        },
      ],
      category: "",
      sortProduct: "",
      healthBenefit: [],
      nutritionValue: "",
      ingredient: "",
      howOurProductIsMade: "",
      images: [],
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

  // Create stable image URLs using useMemo to prevent flickering
  const stableImageUrls = useMemo(() => {
    const images = form.watch("images");
    if (images.length === 0) return [];

    // Clean up old URLs
    imageUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    // Create new URLs
    const newUrls = images.map((file) => URL.createObjectURL(file));
    setImageUrls(newUrls);
    return newUrls;
  }, [form.watch("images")]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const addHealthBenefit = () => {
    if (healthBenefitInput.trim()) {
      const currentBenefits = form.getValues("healthBenefit");
      form.setValue("healthBenefit", [
        ...currentBenefits,
        healthBenefitInput.trim(),
      ]);
      setHealthBenefitInput("");
    }
  };

  const removeHealthBenefit = (index: number) => {
    const currentBenefits = form.getValues("healthBenefit");
    form.setValue(
      "healthBenefit",
      currentBenefits.filter((_, i) => i !== index)
    );
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    const updatedImages = [...currentImages];

    // Revoke the URL for the removed image
    if (stableImageUrls[index]) {
      URL.revokeObjectURL(stableImageUrls[index]);
    }

    updatedImages.splice(index, 1);

    form.setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Validate image count
    if (updatedImages.length !== 5) {
      form.setError("images", {
        type: "manual",
        message: "Exactly 5 images are required",
      });
    } else {
      form.clearErrors("images");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const existingFiles = form.getValues("images") || [];

    let allFiles = [...existingFiles, ...newFiles];

    // Remove duplicates (same name + size)
    allFiles = allFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    // Check count
    if (allFiles.length === 0) {
      form.setError("images", {
        type: "manual",
        message: "Please select at least 1 image",
      });
      toast.error("Please select at least 1 image");
      return;
    }

    if (allFiles.length > 5) {
      form.setError("images", {
        type: "manual",
        message: "You can upload max 5 images",
      });
      toast.error("You can upload a maximum of 5 images");
      allFiles = allFiles.slice(0, 5);
    }

    // Validate file types
    const invalidFiles = allFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      form.setError("images", {
        type: "manual",
        message: "Only image files are allowed",
      });
      toast.error("Only image files are allowed");
      return;
    }

    // Success
    form.clearErrors("images");
    form.setValue("images", allFiles);

    e.target.value = "";
  };

  const handleVariantImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    onChange: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // ✅ Generate preview URL
    const url = URL.createObjectURL(file);

    // Clean up old URL if exists
    if (variantImageUrls[index]) {
      URL.revokeObjectURL(variantImageUrls[index]);
    }

    setVariantImageUrls((prev) => ({ ...prev, [index]: url }));

    onChange(file); // store file in form state
    e.target.value = "";
  };

  const { incrementProduct } = useStatsStore();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form data:", data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("sortProduct", data.sortProduct);
      formData.append("healthBenefit", JSON.stringify(data.healthBenefit));
      formData.append("nutritionValue", data.nutritionValue);
      formData.append("ingredient", data.ingredient);
      formData.append("howOurProductIsMade", data.howOurProductIsMade);
      formData.append("variants", JSON.stringify(data.variants));
      formData.append("haveShape", JSON.stringify(data.haveShape));

      data.images.forEach((file) => {
        formData.append("images", file);
      });
      data.variants.forEach((variant) => {
        formData.append("variantImages", variant.image);
      });

      const response = await createProduct(formData);
      console.log("Product created:", response);
      toast.success(response.message);
      incrementProduct();
      router.push("/products?type=products");
      console.log(formData);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="container mx-auto ">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Fill in the details to create a new product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        defaultValue={field.value}
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
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);

                            // Reset all weights when switching mode
                            const variants = form.getValues("variants");
                            variants.forEach((_, index) => {
                              if (checked) {
                                // Shape enabled → clear `value`, keep square/circle empty
                                form.setValue(`variants.${index}.weight`, {
                                  square: "",
                                  circle: "",
                                  value: undefined,
                                });
                              } else {
                                // Shape disabled → clear square/circle, keep single value
                                form.setValue(`variants.${index}.weight`, {
                                  square: undefined,
                                  circle: undefined,
                                  value: "",
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
                <div className="col-span-2 md:col-span-1 space-y-4">
                  <FormLabel>Health Benefits</FormLabel>
                  <div className="flex w-full col-span-2 gap-2">
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
                    {form.watch("healthBenefit").map((benefit, index) => (
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
                      {form.formState.errors.healthBenefit.message}
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
                        appendVariant({
                          size: "",
                          price: "",
                          weight: { square: "", circle: "" },
                          image: "",
                        })
                      }
                      className="transition"
                    >
                      + Add More
                    </Button>
                  </div>

                  {variantFields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                      {/* Show remove button on all cards except when there's only one */}
                      {index >= 1 && (
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
                              <FormItem className="space-y-4 col-span-2">
                                <div>
                                  <FormLabel className="text-lg">
                                    Variant Image
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Exactly 1 image is required
                                  </p>
                                </div>

                                {/* Upload Area */}
                                <label htmlFor={`variant-file-upload-${index}`}>
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
                                    onChange={(e) =>
                                      handleVariantImageChange(
                                        e,
                                        index,
                                        field.onChange
                                      )
                                    }
                                  />
                                </label>

                                <FormMessage />
                              </FormItem>
                              {/* Image Preview */}
                              {field.value instanceof File &&
                                variantImageUrls[index] && (
                                  <div className="grid grid-cols-1 gap-4">
                                    <Card className="p-2 relative">
                                      <Image
                                        width={200}
                                        height={200}
                                        src={variantImageUrls[index]} // ✅ use preview URL
                                        alt={`Variant ${index + 1} image`}
                                        className="w-full h-40 object-cover rounded"
                                        unoptimized
                                      />
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => {
                                          field.onChange(null);
                                          if (variantImageUrls[index]) {
                                            URL.revokeObjectURL(
                                              variantImageUrls[index]
                                            );
                                            setVariantImageUrls((prev) => {
                                              const updated = { ...prev };
                                              delete updated[index];
                                              return updated;
                                            });
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                      <p className="text-xs text-center mt-1 truncate">
                                        {field.value.name}
                                      </p>
                                    </Card>
                                  </div>
                                )}
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
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div>
                      <FormLabel className="text-lg">Product Images</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Exactly 5 images are required
                      </p>
                    </div>

                    {/* Upload Area */}
                    <label htmlFor="file-upload">
                      <div className="border border-dashed w-md border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-muted-foreground">
                          Click to upload 5 images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {field.value.length} / 5 images
                        </p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>

                    {/* Image Preview */}
                    {field.value.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {stableImageUrls.map((url, index) => (
                          <Card
                            key={`${index}-${field.value[index]?.name}`}
                            className="p-2 relative"
                          >
                            <Image
                              width={200}
                              height={200}
                              src={url}
                              alt={`Selected ${index + 1}`}
                              className="w-full h-40 object-cover rounded"
                              unoptimized // Important for blob URLs
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                            <p className="text-xs text-center mt-1 truncate">
                              {field.value[index]?.name}
                            </p>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Error Message */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  size="lg"
                >
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
