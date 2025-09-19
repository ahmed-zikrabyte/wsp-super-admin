"use client";

import {
  FolderPlus,
  Image as ImageIcon,
  Info,
  Settings,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  Category,
  CategoryFormData,
  CategoryModalMode,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  parentCategory?: Category | null;
  mode: CategoryModalMode;
  categories: Category[];
  onSuccess: () => void;
  onSubmit: (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => Promise<void>;
}

const SUPPORTED_GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  parentCategory,
  mode,
  categories,
  onSuccess,
  onSubmit,
}: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    parentId: "",
    image: null,
    imageUrl: "",
    supportedGenders: [],
    hasGenderVariants: false,
    hasSizeGuide: false,
    requiresFitting: false,
    displayOrder: 0,
    isActive: true,
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  useEffect(() => {
    if (category && (mode === "edit" || mode === "view")) {
      setFormData({
        name: category.name,
        description: category.metadata?.description || "",
        parentId: category.parentId || "",
        image: null,
        imageUrl: category.metadata?.image || "",
        supportedGenders: category.attributes?.supportedGenders || [],
        hasGenderVariants: category.attributes?.hasGenderVariants || false,
        hasSizeGuide: category.attributes?.hasSizeGuide || false,
        requiresFitting: category.attributes?.requiresFitting || false,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        seo: {
          title: category.metadata?.seo?.title || "",
          description: category.metadata?.seo?.description || "",
          keywords: category.metadata?.seo?.keywords?.join(", ") || "",
        },
      });
      setImagePreview(category.metadata?.image || "");
    } else {
      setFormData({
        name: "",
        description: "",
        parentId: parentCategory?._id || "",
        image: null,
        imageUrl: "",
        supportedGenders: [],
        hasGenderVariants: false,
        hasSizeGuide: false,
        requiresFitting: false,
        displayOrder: 0,
        isActive: true,
        seo: {
          title: "",
          description: "",
          keywords: "",
        },
      });
      setImagePreview("");
    }
  }, [category, mode, parentCategory]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSeoChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  }, []);

  const handleGenderToggle = useCallback((gender: string) => {
    setFormData((prev) => {
      const newGenders = prev.supportedGenders.includes(gender)
        ? prev.supportedGenders.filter((g) => g !== gender)
        : [...prev.supportedGenders, gender];
      return {
        ...prev,
        supportedGenders: newGenders,
        hasGenderVariants: newGenders.length > 0,
      };
    });
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null, imageUrl: "" }));
    setImagePreview("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("sdfasdfsad sdfs");
    e.preventDefault();
    setLoading(true);

    try {
      const submitData: CreateCategoryRequest | UpdateCategoryRequest = {
        name: formData.name,
        parentId: formData.parentId || undefined,
        description: formData.description,
        image: formData.image || formData.imageUrl,
        supportedGenders: formData.supportedGenders,
        hasGenderVariants: formData.hasGenderVariants,
        hasSizeGuide: formData.hasSizeGuide,
        requiresFitting: formData.requiresFitting,
        displayOrder: formData.displayOrder,
        seo: {
          title: formData.seo.title,
          description: formData.seo.description,
          keywords: formData.seo.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      };

      if (mode === "edit") {
        (submitData as UpdateCategoryRequest).isActive = formData.isActive;
      }

      await onSubmit(submitData);
      toast.success(
        `Category ${mode === "create" ? "created" : "updated"} successfully`
      );
      onSuccess();
    } catch (_error) {
      console.log("_error", _error);
      toast.error(`Failed to ${mode} category`);
    } finally {
      setLoading(false);
    }
  };

  const isReadonly = mode === "view";

  // Get available parent categories (excluding self and descendants)
  const availableParentCategories = categories.filter((cat) => {
    if (mode === "edit" && category) {
      return cat._id !== category._id && !cat.path.startsWith(category.path);
    }
    return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            {mode === "create" && "Create New Category"}
            {mode === "edit" && "Edit Category"}
            {mode === "view" && "Category Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="gap-2">
                <Info className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="attributes" className="gap-2">
                <Settings className="h-4 w-4" />
                Attributes
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <Tag className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={isReadonly}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentId">Parent Category</Label>
                      <Select
                        value={formData.parentId || "root"}
                        onValueChange={(value) =>
                          handleInputChange("parentId", value)
                        }
                        disabled={isReadonly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="root">Root Category</SelectItem>{" "}
                          {availableParentCategories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.path} - {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter category description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      disabled={isReadonly}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayOrder">Display Order</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        min="0"
                        value={formData.displayOrder}
                        onChange={(e) =>
                          handleInputChange(
                            "displayOrder",
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={isReadonly}
                      />
                    </div>

                    {mode === "edit" && (
                      <div className="space-y-2">
                        <Label htmlFor="isActive">Status</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                              handleInputChange("isActive", checked)
                            }
                            disabled={isReadonly}
                          />
                          <Badge
                            variant={
                              formData.isActive ? "default" : "secondary"
                            }
                          >
                            {formData.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isReadonly && (
                    <div className="space-y-2">
                      <Label htmlFor="image">Upload Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                      disabled={isReadonly}
                    />
                  </div>

                  {imagePreview && (
                    <div className="space-y-2">
                      <Label>Image Preview</Label>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Category preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        {!isReadonly && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={removeImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Supported Genders</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_GENDERS.map((gender) => (
                          <div
                            key={gender.value}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={gender.value}
                              checked={formData.supportedGenders.includes(
                                gender.value
                              )}
                              onChange={() => handleGenderToggle(gender.value)}
                              disabled={isReadonly}
                              className="rounded"
                            />
                            <Label htmlFor={gender.value}>{gender.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hasSizeGuide"
                          checked={formData.hasSizeGuide}
                          onCheckedChange={(checked) =>
                            handleInputChange("hasSizeGuide", checked)
                          }
                          disabled={isReadonly}
                        />
                        <Label htmlFor="hasSizeGuide">Has Size Guide</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiresFitting"
                          checked={formData.requiresFitting}
                          onCheckedChange={(checked) =>
                            handleInputChange("requiresFitting", checked)
                          }
                          disabled={isReadonly}
                        />
                        <Label htmlFor="requiresFitting">
                          Requires Fitting
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      placeholder="Category SEO title"
                      value={formData.seo.title}
                      onChange={(e) => handleSeoChange("title", e.target.value)}
                      disabled={isReadonly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="Category SEO description"
                      value={formData.seo.description}
                      onChange={(e) =>
                        handleSeoChange("description", e.target.value)
                      }
                      disabled={isReadonly}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">
                      Keywords (comma separated)
                    </Label>
                    <Input
                      id="seoKeywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={formData.seo.keywords}
                      onChange={(e) =>
                        handleSeoChange("keywords", e.target.value)
                      }
                      disabled={isReadonly}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {!isReadonly && (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Category"
                    : "Update Category"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
