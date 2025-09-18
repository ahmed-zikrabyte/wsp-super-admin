"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateCategory, viewCategory } from "@/services/categoryService";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const categorySchema = z.object({
  categoryName: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name must not exceed 50 characters." }),

  image: z.union([
    // Case 1: Editing → existing image URL
    z
      .string()
      .url()
      .nonempty(),

    // Case 2: New upload → FileList
    z
      .any()
      .refine((file) => file?.length === 1, "Image is required.")
      .refine(
        (file) => file?.[0]?.size <= MAX_FILE_SIZE,
        "Max file size is 5MB."
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),
  ]),
});

export default function EditCategoryForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      image: undefined,
    },
  });
  const imageRef = useRef<HTMLInputElement>(null);

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await viewCategory(slug);

        form.reset({
          categoryName: category.data.name,
          image: category.data.image.url,
        });
        setImagePreview(category.data.image.url);
        setExistingImage(category.data.image.url);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [slug]);

  console.log({ existingImage });
  async function onSubmit(values: z.infer<typeof categorySchema>) {
    const formData = new FormData();
    formData.append("name", values.categoryName);

    const newImageFile = values.image?.[0];

    if (newImageFile) {
      formData.append("image", newImageFile);

      // 👇 Only send existing image if new one is uploaded
      if (existingImage) {
        formData.append("existingImage", existingImage);
      }
    }

    try {
      const response = await updateCategory(slug, formData);
      toast.success(response.message);
      router.push("/categories?type=categories");
      form.reset();
      setImagePreview(null);
      setExistingImage(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
      console.error("Error updating category:", error);
    }

    console.log("Form data:", {
      categoryName: values.categoryName,
      image: newImageFile,
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && typeof window !== "undefined") {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
    setExistingImage(null);
  };

  const removeImage = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setImagePreview(null);
    form.setValue("image", undefined);
  };

  return (
    <div className=" mx-auto ">
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-md"
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the display name for your category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => {
                  const inputId = "category-image-upload";

                  return (
                    <FormItem>
                      <FormLabel>Category Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            id={inputId}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e);
                            }}
                            {...field}
                            ref={imageRef}
                            className="hidden"
                          />

                          {!imagePreview ? (
                            <div
                              className="border-2 w-md border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                              onClick={() =>
                                document.getElementById(inputId)?.click()
                              }
                            >
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          ) : (
                            <div
                              className="relative w-32 h-32 cursor-pointer group"
                              onClick={() =>
                                document.getElementById(inputId)?.click()
                              }
                            >
                              <Image
                                src={
                                  existingImage ||
                                  imagePreview ||
                                  "/placeholder.svg"
                                }
                                alt="Preview"
                                fill
                                className="object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 opacity-80 group-hover:opacity-100 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage();
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload an image to represent this category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end">
                <Button
                  disabled={form.formState.isSubmitting}
                  className="bg-black cursor-pointer text-white"
                  type="submit"
                >
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update Category"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
