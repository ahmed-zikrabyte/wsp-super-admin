"use client";

import {
  BarChart3,
  FolderPlus,
  Grid3X3,
  List,
  MoreHorizontal,
  RefreshCw,
  Search,
  TreePine,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import CategoryModal from "@/components/categories/category-modal";
import { CategoryTree } from "@/components/categories/category-tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  createCategory,
  deleteCategory,
  getCategoryStats,
  getCategoryTree,
  moveCategory,
  updateCategory,
} from "@/services/categoryService";

import type {
  Category,
  CategoryFilters,
  CategoryStats,
  CategoryTreeNode,
  CategoryViewMode,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.types";

export default function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<CategoryFilters>;
}) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<CategoryViewMode>("tree");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["1", "2"])
  );
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
    level: undefined,
    isActive: undefined,
    sortBy: "displayOrder",
    sortOrder: "asc",
  });

  // Load data
  useEffect(() => {
    loadCategories();
    loadStats();
  }, [filters]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoryTree();
      console.log({ data: data?.data?.tree });
      setCategories(data?.data?.tree);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
      // Fallback to empty array for development
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getCategoryStats();
      setStats(data?.data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
      toast.error("Failed to load statistics");
      // Fallback stats for development
      setStats({
        totalCategories: 0,
        activeCategories: 0,
        inactiveCategories: 0,
        categoriesByLevel: {},
        totalProducts: 0,
        categoriesWithProducts: 0,
        topCategories: [],
      });
    }
  };

  // Modal handlers
  const openCreateModal = useCallback((parent?: Category) => {
    setSelectedCategory(null);
    setParentCategory(parent || null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((category: Category) => {
    setSelectedCategory(category);
    setParentCategory(null);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const openViewModal = useCallback((category: Category) => {
    setSelectedCategory(category);
    setParentCategory(null);
    setModalMode("view");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setParentCategory(null);
  }, []);

  // Category operations
  const handleCategorySubmit = async (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    try {
      if (modalMode === "create") {
        await createCategory(data as CreateCategoryRequest);
        toast.success("Category created successfully");
      } else if (selectedCategory) {
        await updateCategory(
          selectedCategory._id,
          data as UpdateCategoryRequest
        );
        toast.success("Category updated successfully");
      }
      loadCategories();
      loadStats();
      closeModal();
    } catch (error) {
      console.error("Failed to submit category:", error);
      throw error;
    }
  };

  const handleCategoryDelete = useCallback(async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category._id);
        toast.success("Category deleted successfully");
        loadCategories();
        loadStats();
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  }, []);

  const handleCategoryMove = useCallback(
    async (categoryId: string, newParentId?: string) => {
      try {
        await moveCategory(categoryId, { newParentId });
        toast.success("Category moved successfully");
        loadCategories();
        loadStats();
      } catch (error) {
        console.error("Failed to move category:", error);
        toast.error("Failed to move category");
      }
    },
    []
  );

  // Filter handlers
  const handleFilterChange = useCallback(
    (key: keyof CategoryFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      level: undefined,
      isActive: undefined,
      sortBy: "displayOrder",
      sortOrder: "asc",
    });
  }, []);

  // Tree handlers
  const handleToggleExpanded = useCallback((categoryId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    const getAllIds = (categories: CategoryTreeNode[]): string[] => {
      return categories.reduce((acc, cat) => {
        acc.push(cat._id);
        if (cat.children.length > 0) {
          acc.push(...getAllIds(cat.children));
        }
        return acc;
      }, [] as string[]);
    };
    setExpandedIds(new Set(getAllIds(categories)));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // Get flat list of categories for the modal
  const flatCategories = useCallback((cats: CategoryTreeNode[]): Category[] => {
    return cats?.reduce((acc, cat) => {
      acc.push(cat as Category);
      if (cat.children.length > 0) {
        acc.push(...flatCategories(cat.children));
      }
      return acc;
    }, [] as Category[]);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and hierarchy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadCategories} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => openCreateModal()} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Categories
              </CardTitle>
              <FolderPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeCategories} active, {stats?.inactiveCategories}{" "}
                inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats?.categoriesWithProducts} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hierarchy Levels
              </CardTitle>
              <TreePine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(stats?.categoriesByLevel || {}).length}
              </div>
              <div className="flex gap-1 mt-1">
                {Object.entries(stats?.categoriesByLevel || {}).map(
                  ([level, count]) => (
                    <Badge key={level} variant="outline" className="text-xs">
                      L{level}: {count}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (stats?.activeCategories / stats?.totalCategories) * 100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Categories active</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and View Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={resolvedSearchParams.level?.toString() || "all"}
                onValueChange={(value) => {
                  const params = new URLSearchParams(
                    resolvedSearchParams as Record<string, string>
                  );
                  if (value === "all") {
                    params.delete("level");
                  } else {
                    params.set("level", value);
                  }
                  router.push(`?${params.toString()}`);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>{" "}
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={resolvedSearchParams.status || "all"}
                onValueChange={(value) => {
                  const params = new URLSearchParams(
                    resolvedSearchParams as Record<string, string>
                  );
                  if (value === "all") {
                    params.delete("status");
                  } else {
                    params.set("status", value);
                  }
                  router.push(`?${params.toString()}`);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>{" "}
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={resolvedSearchParams.sortBy || "displayOrder"}
                onValueChange={(value) => {
                  const params = new URLSearchParams(
                    resolvedSearchParams as Record<string, string>
                  );
                  if (value === "displayOrder") {
                    params.delete("sortBy");
                  } else {
                    params.set("sortBy", value);
                  }
                  router.push(`?${params.toString()}`);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="displayOrder">Display Order</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-8" />

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "tree" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("tree")}
                  className="h-8 w-8 p-0"
                >
                  <TreePine className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {viewMode === "tree" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MoreHorizontal className="h-4 w-4" />
                      Tree Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={expandAll}
                      className="w-full justify-start"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={collapseAll}
                      className="w-full justify-start"
                    >
                      Collapse All
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="flex-1">
        <CardContent className="p-6">
          {viewMode === "tree" && (
            <CategoryTree
              categories={categories}
              loading={loading}
              onCategorySelect={openViewModal}
              onCategoryEdit={openEditModal}
              onCategoryView={openViewModal}
              onCategoryDelete={handleCategoryDelete}
              onCategoryMove={handleCategoryMove}
              onCreateSubcategory={openCreateModal}
              selectedCategoryId={selectedCategory?._id}
              expandedIds={expandedIds}
              onToggleExpanded={handleToggleExpanded}
            />
          )}

          {(viewMode === "list" || viewMode === "grid") && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {viewMode === "list" ? "List View" : "Grid View"}
                </div>
                <p>Coming soon...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        category={selectedCategory}
        parentCategory={parentCategory}
        mode={modalMode}
        categories={flatCategories(categories)}
        onSuccess={loadCategories}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
}
