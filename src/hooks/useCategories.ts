"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getCategoryStats, getCategoryTree } from "@/services/categoryService";
// import categoryService from "@/services/categoryService";
import type {
  Category,
  CategoryFilters,
  CategoryStats,
  CategoryTreeNode,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.types";

export interface UseCategoriesReturn {
  // Data
  categories: CategoryTreeNode[];
  stats: CategoryStats | null;
  loading: boolean;
  selectedCategory: Category | null;

  // Filters
  filters: CategoryFilters;
  setFilters: (filters: CategoryFilters) => void;

  // Actions
  loadCategories: () => Promise<void>;
  loadStats: () => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  moveCategory: (categoryId: string, newParentId?: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;
  uploadCategoryImage: (id: string, file: File) => Promise<void>;

  // Selection
  selectCategory: (category: Category | null) => void;

  // Search
  searchCategories: (query: string) => Promise<Category[]>;

  // Validation
  validateCategoryName: (
    name: string,
    parentId?: string,
    excludeId?: string
  ) => Promise<boolean>;
}

export function useCategories(
  initialFilters?: CategoryFilters
): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [filters, setFilters] = useState<CategoryFilters>(
    initialFilters || {
      search: "",
      level: undefined,
      isActive: undefined,
      sortBy: "displayOrder",
      sortOrder: "asc",
    }
  );

  // Load categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoryTree();
      setCategories(data?.data?.tree);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load statistics
  const loadStats = useCallback(async () => {
    try {
      const data = await getCategoryStats();
      setStats(data?.data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
      toast.error("Failed to load statistics");
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
  }, []);

  // Create category
  const createCategory = useCallback(
    async (data: CreateCategoryRequest) => {
      try {
        await createCategory(data);
        toast.success("Category created successfully");
        await Promise.all([loadCategories(), loadStats()]);
      } catch (error) {
        console.error("Failed to create category:", error);
        toast.error("Failed to create category");
        throw error;
      }
    },
    [loadCategories, loadStats]
  );

  // Update category
  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryRequest) => {
      try {
        await updateCategory(id, data);
        toast.success("Category updated successfully");
        await Promise.all([loadCategories(), loadStats()]);
      } catch (error) {
        console.error("Failed to update category:", error);
        toast.error("Failed to update category");
        throw error;
      }
    },
    [loadCategories, loadStats]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
        await Promise.all([loadCategories(), loadStats()]);
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
        throw error;
      }
    },
    [loadCategories, loadStats]
  );

  // Move category
  const moveCategory = useCallback(
    async (categoryId: string, newParentId?: string) => {
      try {
        await moveCategory(categoryId, newParentId);
        toast.success("Category moved successfully");
        await Promise.all([loadCategories(), loadStats()]);
      } catch (error) {
        console.error("Failed to move category:", error);
        toast.error("Failed to move category");
        throw error;
      }
    },
    [loadCategories, loadStats]
  );

  // Toggle category status
  const toggleCategoryStatus = useCallback(
    async (id: string) => {
      try {
        await toggleCategoryStatus(id);
        toast.success("Category status updated successfully");
        await Promise.all([loadCategories(), loadStats()]);
      } catch (error) {
        console.error("Failed to update category status:", error);
        toast.error("Failed to update category status");
        throw error;
      }
    },
    [loadCategories, loadStats]
  );

  // Upload category image
  const uploadCategoryImage = useCallback(
    async (id: string, file: File) => {
      try {
        await uploadCategoryImage(id, file);
        toast.success("Category image uploaded successfully");
        await loadCategories();
      } catch (error) {
        console.error("Failed to upload category image:", error);
        toast.error("Failed to upload category image");
        throw error;
      }
    },
    [loadCategories]
  );

  // Select category
  const selectCategory = useCallback((category: Category | null) => {
    setSelectedCategory(category);
  }, []);

  // Search categories
  const searchCategories = useCallback(
    async (query: string): Promise<Category[]> => {
      try {
        return await searchCategories(query);
      } catch (error) {
        console.error("Failed to search categories:", error);
        toast.error("Failed to search categories");
        return [];
      }
    },
    []
  );

  // Validate category name
  const validateCategoryName = useCallback(
    async (
      name: string,
      parentId?: string,
      excludeId?: string
    ): Promise<boolean> => {
      try {
        return await validateCategoryName(name, parentId, excludeId);
      } catch (error) {
        console.error("Failed to validate category name:", error);
        return false;
      }
    },
    []
  );

  // Load data on mount and when filters change
  useEffect(() => {
    loadCategories();
    loadStats();
  }, [loadCategories, loadStats]);

  return {
    // Data
    categories,
    stats,
    loading,
    selectedCategory,

    // Filters
    filters,
    setFilters,

    // Actions
    loadCategories,
    loadStats,
    createCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    toggleCategoryStatus,
    uploadCategoryImage,

    // Selection
    selectCategory,

    // Search
    searchCategories,

    // Validation
    validateCategoryName,
  };
}
